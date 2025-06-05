import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { DiscardEffect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class DiscardRule extends EffectRule<DiscardEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves

    const effect = this.effect
    if (effect.full) {
      moves.push(
        this.hand.moveItemsAtOnce({
          type: LocationType.AgentDiscard
        })
      )

      moves.push(...this.afterEffectPlayed())
    }

    return moves
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    moves.push(
      ...this.hand.moveItems({
        type: LocationType.AgentDiscard
      })
    )

    return moves
  }

  getQuantityFromMove(move: ItemMove) {
    const firstEffect = this.firstEffect!
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard) {
      const isWinCredit = firstEffect.type === EffectType.Conditional && firstEffect.effect.type === EffectType.WinCredit
      if (isWinCredit) {
        const card = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
        return Agents[card.id].cost
      }
    }

    return 0
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.AgentDiscard) return []
    this.removeFirstEffect()
    return this.afterEffectPlayed()
  }

  isPossible(): boolean {
    return this.hand.length > 0
  }

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }
}
