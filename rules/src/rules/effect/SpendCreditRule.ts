import { CustomMove, isCustomMoveType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { SpendCreditEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { CustomMoveType } from '../CustomMoveType'
import { EffectRule } from './index'

export class SpendCreditRule extends EffectRule<SpendCreditEffect> {
  getPlayerMoves() {
    const credits = this.playerHelper.credits
    const effect = this.effect
    const moves: MaterialMove[] = []
    for (const quantity of effect.quantities) {
      if (credits < quantity) continue
      moves.push(this.customMove(CustomMoveType.SpendCredit, quantity))
    }

    return moves
  }

  getExtraDataFromMove(move: ItemMove | CustomMove) {
    if (!isCustomMoveType(CustomMoveType.SpendCredit)(move)) return {}
    return { quantity: move.data as number }
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(CustomMoveType.SpendCredit)(move)) return []
    const cost: number = move.data
    const money = this.creditMoney
    return money.removeMoney(cost, { type: LocationType.TeamCredit, player: this.playerHelper.team })
  }

  isPossible(): boolean {
    return this.getPlayerMoves().length > 0
  }
}
