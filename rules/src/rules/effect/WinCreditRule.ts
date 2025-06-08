import { MaterialMove } from '@gamepark/rules-api'
import { WinCreditEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { EffectRule } from './index'

export class WinCreditRule extends EffectRule<WinCreditEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const money = this.creditMoney
    moves.push(...money.addMoney(this.wonCredit, { type: LocationType.TeamCredit, player: this.effect.opponent ? this.opponentTeam : this.playerHelper.team }))

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  get wonCredit() {
    if (this.effect.quantity) return this.effect.quantity
    // TODO: other effects
    return 0
  }

  setExtraData(_extraData: Record<string, unknown>) {
    if (_extraData.quantity) {
      this.effect.quantity ??= _extraData.quantity as number
    }
  }
}
