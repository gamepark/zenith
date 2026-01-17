import { isMoveItemTypeAtOnce, isShuffleItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Influence, influences } from '../material/Influence'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { getTeamColor, TeamColor } from '../TeamColor'
import { PlayerHelper } from './helper/PlayerHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class RefillRule extends PlayerTurnRule {
  onRuleStart() {
    this.memorize(Memory.AlreadyPlayedPlayers, (p: PlayerId[] = []) => p.concat(this.player))
    const moves: MaterialMove[] = []

    for (const influence of influences) {
      const planet = this.material(MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace).locationId(influence)
      if (planet.length) continue
      moves.push(
        this.getNewInfluenceDisc(influence).moveItem({
          type: LocationType.PlanetBoardInfluenceDiscSpace,
          id: influence,
          x: 0
        })
      )
    }

    const maxSize = this.handSize
    moves.push(...this.refillHand(maxSize))
    if (moves.some((move) => isMoveItemTypeAtOnce(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDeck)) {
      return moves
    }

    moves.push(...this.endRuleMoves)

    return moves
  }

  getNewInfluenceDisc(influence: Influence) {
    return this.material(MaterialType.InfluenceDisc)
      .location(LocationType.InfluenceDiscStock)
      .locationId(influence)
      .maxBy((item) => item.location.x!)
  }

  get endRuleMoves(): MaterialMove[] {
    const alreadyPlayed = this.remind<PlayerId[]>(Memory.AlreadyPlayedPlayers) ?? []
    const currentTeam = this.currentTeam
    const teamPlayers = this.getTeamPlayers(currentTeam)
    const teamPlayersPlayed = alreadyPlayed.filter(p => getTeamColor(p) === currentTeam).length

    if (this.game.players.length === 4) {
      // 4 players mode: teams alternate, each team plays 2 turns
      if (teamPlayersPlayed < 2) {
        // Teammate still needs to play
        const nextPlayer = teamPlayers.find(p => !alreadyPlayed.includes(p))!
        return [this.startPlayerTurn(RuleId.PlayCard, nextPlayer)]
      } else {
        // Team finished, switch to other team
        const otherTeam = currentTeam === TeamColor.White ? TeamColor.Black : TeamColor.White
        this.memorize(Memory.CurrentTeam, otherTeam)
        this.memorize(Memory.AlreadyPlayedPlayers, [])
        const otherTeamPlayers = this.getTeamPlayers(otherTeam)
        return [this.startSimultaneousRule(RuleId.PickOrder, otherTeamPlayers)]
      }
    } else {
      // 2 players mode: simple alternation
      return [this.startPlayerTurn(RuleId.PlayCard, this.nextPlayer)]
    }
  }

  get currentTeam(): TeamColor {
    return this.remind<TeamColor>(Memory.CurrentTeam) ?? TeamColor.White
  }

  getTeamPlayers(team: TeamColor): PlayerId[] {
    return this.game.players.filter(p => getTeamColor(p) === team)
  }

  get nextPlayer(): PlayerId {
    const players = this.game.players
    return players[(players.indexOf(this.player) + 1) % players.length]
  }

  get handSize() {
    const leaderBadge = this.leaderBadge
    if (!leaderBadge.length) {
      return 4
    } else {
      const item = leaderBadge.getItem()!
      if (!item.location.rotation) {
        return 5
      } else {
        return 6
      }
    }
  }

  refillHand(maxCount: number) {
    const deck = this.deck
    const quantity = Math.max(0, maxCount - this.hand.length)
    if (!quantity) return []
    const moves: MaterialMove[] = deck.deal(
      {
        type: LocationType.PlayerHand,
        player: this.player
      },
      quantity
    )

    const remaining = quantity - moves.length
    if (!remaining) return moves
    moves.push(this.discard.moveItemsAtOnce({ type: LocationType.AgentDeck }))
    return moves
  }

  get discard() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDiscard)
  }

  afterItemMove(move: ItemMove) {
    if (isShuffleItemType(MaterialType.AgentCard)(move)) {
      return [...this.refillHand(this.handSize), ...this.endRuleMoves]
    }

    if (isMoveItemTypeAtOnce(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDeck) {
      return [this.deck.shuffle()]
    }

    return []
  }

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }

  get deck() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
  }

  get leaderBadge() {
    return this.material(MaterialType.LeaderBadgeToken).player(new PlayerHelper(this.game, this.player).team)
  }
}
