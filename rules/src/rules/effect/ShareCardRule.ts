import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { ShareCardEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { CustomMoveType } from '../CustomMoveType'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class ShareCardRule extends EffectRule<ShareCardEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    this.memorize(Memory.ShareCardRemaining, this.effect.maxQuantity)
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []

    // Can always pass (give 0 cards)
    moves.push(this.customMove(CustomMoveType.Pass))

    // Can select cards from hand to give to teammate
    moves.push(
      ...this.hand.moveItems({
        type: LocationType.PlayerHand,
        player: this.teammate
      })
    )

    return moves
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.Pass)(move)) {
      this.forget(Memory.ShareCardRemaining)
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.PlayerHand) return []

    const remaining = this.remind<number>(Memory.ShareCardRemaining) - 1
    this.memorize(Memory.ShareCardRemaining, remaining)

    if (remaining === 0 || this.hand.length === 0) {
      this.forget(Memory.ShareCardRemaining)
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return []
  }

  getExtraDataFromMove(move: ItemMove | CustomMove) {
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.PlayerHand) {
      const card = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      return { quantity: Agents[card.id].cost, influence: Agents[card.id].influence }
    }
    return {}
  }

  isPossible(): boolean {
    return this.game.players.length === 4
  }

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }

  get teammate(): PlayerId {
    // White team: 1 <-> 4, Black team: 2 <-> 3
    switch (this.player) {
      case 1: return 4
      case 4: return 1
      case 2: return 3
      case 3: return 2
      default: return this.player
    }
  }
}
