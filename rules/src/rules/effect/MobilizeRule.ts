import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { MobilizeEffect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { DeckHelper } from '../helper/DeckHelper'
import { EffectRule } from './index'

export class MobilizeRule extends EffectRule<MobilizeEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    return this.getAutomaticEffectMoves()
  }

  getAutomaticEffectMoves(): MaterialMove[] {
    const quantity = this.effect.quantity ?? 1
    if (!this.isPossible()) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }
    return [this.customMove(CustomMoveType.Mobilize, { team: this.playerHelper.team, quantity })]
  }

  decrement(move: ItemMove): boolean {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.Influence) return false

    if (this.effect.quantity) {
      this.effect.quantity--
      return this.effect.quantity === 0
    }

    return true
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.Influence) return []

    // Effect may have already been removed by a previous move in the same batch
    if (!this.firstEffect || this.firstEffect.type !== EffectType.Mobilize) return []

    if (this.effect.quantity) {
      this.effect.quantity--
    }

    const deckHelper = new DeckHelper(this.game)
    const exhausted = deckHelper.deck.length === 0 && deckHelper.discard.length === 0
    if (!this.effect.quantity || exhausted) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return []
  }

  getExtraDataFromMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
      const card = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      return { quantity: Agents[card.id].cost, influence: Agents[card.id].influence }
    }

    return {}
  }

  isPossible() {
    const deckHelper = new DeckHelper(this.game)
    return deckHelper.deck.length > 0 || deckHelper.discard.length > 0
  }
}
