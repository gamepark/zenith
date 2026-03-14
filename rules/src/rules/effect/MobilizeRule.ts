import { isMoveItemType, isMoveItemTypeAtOnce, isShuffleItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { MobilizeEffect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { DeckHelper } from '../helper/DeckHelper'
import { EffectRule } from './index'

export class MobilizeRule extends EffectRule<MobilizeEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    return this.getAutomaticEffectMoves()
  }

  getAutomaticEffectMoves(): MaterialMove[] {
    const deckHelper = new DeckHelper(this.game)
    const agent = deckHelper.deck.limit(this.effect.quantity ?? 1)

    if (!agent.length) {
      const reshuffle = deckHelper.reshuffleDiscardIfDeckEmpty()
      if (reshuffle.length) return reshuffle
      // No cards left anywhere — skip remaining mobilizations
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return agent.moveItems((item) => ({
      type: LocationType.Influence,
      id: item.id !== undefined ? Agents[item.id as Agent].influence : undefined,
      player: this.playerHelper.team
    }))
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
    const deckHelper = new DeckHelper(this.game)

    if (isMoveItemTypeAtOnce(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDeck) {
      return [deckHelper.shuffleDeck()]
    }

    if (isShuffleItemType(MaterialType.AgentCard)(move)) {
      // After reshuffle, try to mobilize again
      return this.getAutomaticEffectMoves()
    }

    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.Influence) return []

    // Effect may have already been removed by a previous move in the same batch
    if (!this.firstEffect || this.firstEffect.type !== EffectType.Mobilize) return []

    if (this.effect.quantity) {
      this.effect.quantity--
    }

    if (!this.effect.quantity) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    // Still more to mobilize — check if deck needs reshuffle or is empty
    const reshuffle = deckHelper.reshuffleDiscardIfDeckEmpty()
    if (!reshuffle.length && !deckHelper.deck.length) {
      // No cards left anywhere — skip remaining mobilizations
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }
    return reshuffle
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
