import { MaterialMove } from '@gamepark/rules-api'
import { GiveZenithiumEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class GiveZenithiumRule extends EffectRule<GiveZenithiumEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    this.memorize(Memory.CurrentEffect, JSON.parse(JSON.stringify(this.effect)))
    this.memorize(Memory.Zenithium, this.effect.quantity)

    moves.push(
      ...this.zenithium.moveItems(
        {
          type: LocationType.TeamZenithium,
          player: this.opponentTeam
        },
        this.effect.quantity
      )
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())

    return moves
  }

  get zenithium() {
    return this.material(MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(this.playerHelper.team)
  }

  isPossible() {
    return this.zenithium.getQuantity() >= (this.effect.quantity ?? 1)
  }

  onRuleEnd() {
    this.forget(Memory.CurrentEffect)
    this.forget(Memory.Zenithium)
    return []
  }
}
