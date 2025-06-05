import { MaterialMove } from '@gamepark/rules-api'
import { WinZenithiumEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerHelper } from '../helper/PlayerHelper'
import { EffectRule } from './index'

export class WinZenithiumRule extends EffectRule<WinZenithiumEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves

    moves.push(
      this.zenithium.createItem({
        location: {
          type: LocationType.TeamZenithium,
          player: new PlayerHelper(this.game, this.opponentTeam).team
        },
        quantity: this.effect.quantity ?? 1
      })
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())

    return moves
  }

  setQuantity(quantity: number) {
    this.effect.quantity ??= quantity
  }

  get zenithium() {
    return this.material(MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(this.playerHelper.team)
  }
}
