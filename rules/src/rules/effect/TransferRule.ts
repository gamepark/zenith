import { isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { TransferEffect } from '../../material/effect/Effect'
import { influences } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class TransferRule extends EffectRule<TransferEffect> {
  getPlayerMoves() {
    return this.transferOneCard()
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

    if (this.effect.quantity) {
      this.effect.quantity--
    }

    if (!this.effect.quantity) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return []
  }

  transferOneCard() {
    const allInfluences = influences
    const allCards = this.material(MaterialType.AgentCard).location(LocationType.Influence)
    return allInfluences
      .filter((influence) => (this.effect.influence ? influence === this.effect.influence : true))
      .flatMap((influence) =>
        allCards.locationId(influence).moveItems({
          type: LocationType.AgentDiscard
        })
      )
  }
}
