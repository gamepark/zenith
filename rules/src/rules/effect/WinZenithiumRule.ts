import { MaterialMove } from '@gamepark/rules-api'
import { WinZenithiumEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class WinZenithiumRule extends EffectRule<WinZenithiumEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves

    moves.push(
      this.zenithium.createItem({
        location: {
          type: LocationType.TeamZenithium,
          player: this.effect.opponent ? this.opponentTeam : this.playerHelper.team
        },
        quantity: this.effect.quantity ?? 1
      })
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())

    return moves
  }

  setExtraData(_extraData: Record<string, unknown>) {
    if (_extraData.quantity) {
      this.effect.quantity ??= _extraData.quantity as number
    }
  }

  get zenithium() {
    return this.material(MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(this.playerHelper.team)
  }
}
