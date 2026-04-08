import { CustomMove, isCustomMoveType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { RuleMove } from '@gamepark/rules-api/dist/material/moves'
import { RuleStep } from '@gamepark/rules-api/dist/material/rules/RuleStep'
import { PlayMoveContext } from '@gamepark/rules-api/dist/Rules'
import { SpendCreditEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { CustomMoveType } from '../CustomMoveType'
import { EffectRule } from './index'

export class SpendCreditRule extends EffectRule<SpendCreditEffect> {
  onRuleStart(_move: RuleMove, _previousRule?: RuleStep, _context?: PlayMoveContext) {
    const cost: number = this.effect.quantity!
    const money = this.creditMoney
    const moves: MaterialMove[] = money.removeMoney(cost, { type: LocationType.TeamCredit, player: this.playerHelper.team })
    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  getPlayerMoves() {
    const credits = this.playerHelper.credits
    const effect = this.effect
    const moves: MaterialMove[] = []
    const quantities = effect.quantities ?? []
    for (const quantity of quantities) {
      if (credits < quantity) continue
      moves.push(this.customMove(CustomMoveType.DoCondition, quantity))
    }

    return moves
  }

  getExtraDataFromMove(move: ItemMove | CustomMove) {
    if (!isCustomMoveType(CustomMoveType.DoCondition)(move)) return {}
    const quantity = move.data as number
    this.effect.quantity ??= quantity
    const index = this.effect.quantities.indexOf(quantity)
    return { factor: this.effect.factors[index] }
  }

  isPossible(): boolean {
    return this.getPlayerMoves().length > 0
  }
}
