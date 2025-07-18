import { isMoveItemTypeAtOnce, isShuffleItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Influence, influences } from '../material/Influence'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
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

    /*
     * TODO: next player at 4-players is a choice
     */
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
    const isTurnEnded = this.remind<PlayerId[]>(Memory.AlreadyPlayedPlayers).length === this.game.players.length
    if (isTurnEnded) {
      this.forget(Memory.AlreadyPlayedPlayers)
      // TODO: 4-p GO to order choice
      return [this.startPlayerTurn(RuleId.PlayCard, this.turnOrder[0])]
    } else {
      return [this.startPlayerTurn(RuleId.PlayCard, this.nextPlayer)]
    }
  }

  get turnOrder(): PlayerId[] {
    return this.remind<PlayerId[]>(Memory.TurnOrder)
  }

  get nextPlayer(): PlayerId {
    const players = this.turnOrder
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
