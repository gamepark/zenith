import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { TransferEffect } from '../../material/effect/Effect'
import { influences } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class TransferRule extends EffectRule<TransferEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    if (this.effect.influence && (this.effect.quantity ?? 1) === 1) return this.transferOneCard()
    return moves
  }

  getPlayerMoves() {
    return this.transferOneCard()
  }

  decrement(move: ItemMove): boolean {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.Influence) return false
    if (this.effect.quantity) {
      this.effect.quantity--
      return this.effect.quantity === 0 || !this.isPossible()
    }

    return true
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.Influence) return []

    if (this.effect.quantity) {
      this.effect.quantity--
    }

    if (!this.effect.quantity || !this.isPossible()) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return []
  }

  isPossible(): boolean {
    return this.influenceCards.length >= (this.effect.quantity ?? 1)
  }

  transferOneCard() {
    const allInfluences = influences
    const allCards = this.influenceCards
    return allInfluences
      .filter((influence) => (this.effect.influence ? influence === this.effect.influence : true))
      .flatMap((influence) =>
        allCards
          .locationId(influence)
          .maxBy((item) => item.location.x!)
          .moveItems({
            type: LocationType.Influence,
            id: influence,
            player: this.playerHelper.team
          })
      )
  }

  get influenceCards() {
    const cards = this.material(MaterialType.AgentCard).location(LocationType.Influence).player(this.opponentTeam)
    if (this.effect.influence) return cards.filter<Agent>((item) => Agents[item.id].influence === this.effect.influence)
    return cards
  }

  getExtraDataFromMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
      const card = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      return { quantity: Agents[card.id].cost, influence: Agents[card.id].influence }
    }

    return {}
  }
}
