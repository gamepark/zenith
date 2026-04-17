import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { influences } from '../material/Influence'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { TeamColor } from '../TeamColor'
import { CustomMoveType } from './CustomMoveType'
import { DeckHelper } from './helper/DeckHelper'
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
        this.material(MaterialType.InfluenceDisc).createItem({
          id: influence,
          location: {
            type: LocationType.PlanetBoardInfluenceDiscSpace,
            id: influence,
            x: 0
          }
        })
      )
    }

    const missing = Math.max(0, this.handSize - this.hand.length)
    if (missing > 0) {
      this.memorize(Memory.Refilling, true)
      moves.push(this.customMove(CustomMoveType.Refill, { player: this.player, quantity: missing }))
      return moves
    }

    moves.push(...this.endRuleMoves)
    return moves
  }

  afterItemMove(move: ItemMove) {
    if (!this.remind(Memory.Refilling)) return []
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.PlayerHand) return []
    const { deck, discard } = new DeckHelper(this.game)
    if (this.hand.length < this.handSize && (deck.length > 0 || discard.length > 0)) return []

    this.forget(Memory.Refilling)
    return this.endRuleMoves
  }

  get endRuleMoves(): MaterialMove[] {
    const alreadyPlayed = this.remind<PlayerId[]>(Memory.AlreadyPlayedPlayers) ?? []
    const currentTeam = this.currentTeam
    const teamPlayers = this.getTeamPlayers(currentTeam)
    const teamPlayersPlayed = alreadyPlayed.filter(p => new PlayerHelper(this.game, p).team === currentTeam).length

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
    return this.game.players.filter(p => new PlayerHelper(this.game, p).team === team)
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

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }

  get leaderBadge() {
    return this.material(MaterialType.LeaderBadgeToken).player(new PlayerHelper(this.game, this.player).team)
  }
}
