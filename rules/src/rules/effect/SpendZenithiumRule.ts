import { CustomMove, isCustomMoveType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { RuleMove } from '@gamepark/rules-api/dist/material/moves'
import { RuleStep } from '@gamepark/rules-api/dist/material/rules/RuleStep'
import { PlayMoveContext } from '@gamepark/rules-api/dist/Rules'
import { SpendZenithiumEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { EffectRule } from './index'

export class SpendZenithiumRule extends EffectRule<SpendZenithiumEffect> {
  onRuleStart(_move: RuleMove, _previousRule?: RuleStep, _context?: PlayMoveContext) {
    const cost: number = this.effect.quantity!
    const moves: MaterialMove[] = [this.zenithium.deleteItem(cost)]
    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  getPlayerMoves() {
    const zenithium = this.playerHelper.zenithium
    const effect = this.effect
    const moves: MaterialMove[] = []
    for (const quantity of effect.quantities) {
      if (zenithium < quantity) continue
      moves.push(this.customMove(CustomMoveType.DoCondition, quantity))
    }

    return moves
  }

  get zenithium() {
    return this.material(MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(this.playerHelper.team)
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
