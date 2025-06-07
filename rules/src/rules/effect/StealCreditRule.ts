import { MaterialMove } from '@gamepark/rules-api'
import { credits } from '../../material/Credit'
import { StealCreditEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class StealCreditRule extends EffectRule<StealCreditEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const money = this.creditMoney
    moves.push(
      ...money.moveMoney(
        { type: LocationType.TeamCredit, player: this.opponentTeam },
        { type: LocationType.TeamCredit, player: this.playerHelper.team },
        this.effect.quantity
      )
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  isPossible() {
    const opponentCredits = this.material(MaterialType.CreditToken).money(credits).player(this.opponentTeam).count
    return opponentCredits >= this.effect.quantity
  }
}
