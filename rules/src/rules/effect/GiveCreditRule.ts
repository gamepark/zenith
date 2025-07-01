import { CustomMove, isCustomMoveType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { GiveCreditEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { CustomMoveType } from '../CustomMoveType'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class GiveCreditRule extends EffectRule<GiveCreditEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const money = this.creditMoney
    this.memorize(Memory.CurrentEffect, JSON.parse(JSON.stringify(this.effect)))
    this.memorize(Memory.Credit, this.effect.quantity)
    moves.push(
      ...money.moveMoney(
        { type: LocationType.TeamCredit, player: this.playerHelper.team },
        { type: LocationType.TeamCredit, player: this.opponentTeam },
        this.effect.quantity
      )
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  getExtraDataFromMove(move: ItemMove | CustomMove) {
    if (!isCustomMoveType(CustomMoveType.DoCondition)(move)) return {}
    return { quantity: move.data as number }
  }

  isPossible() {
    return this.playerHelper.credits >= this.effect.quantity
  }

  onRuleEnd() {
    this.forget(Memory.CurrentEffect)
    this.forget(Memory.Credit)
    return []
  }
}
