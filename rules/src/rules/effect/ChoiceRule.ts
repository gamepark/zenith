import { CustomMove, isCustomMoveType } from '@gamepark/rules-api'
import { ChoiceEffect, Effect } from '../../material/effect/Effect'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export enum Choice {
  LEFT = 1,
  RIGHT
}
export class ChoiceRule extends EffectRule<ChoiceEffect> {
  getPlayerMoves() {
    return [this.customMove(CustomMoveType.Choice, Choice.LEFT), this.customMove(CustomMoveType.Choice, Choice.RIGHT)]
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(MaterialType.InfluenceDisc)(move)) return []
    this.choice(move.data as Choice)
    return this.applyFirstEffect()
  }

  choice(choice: Choice) {
    this.memorize(Memory.Effects, (effects: Effect[]) => {
      const firstEffect = effects[0] as ChoiceEffect
      const { left, right } = firstEffect

      if (choice === Choice.LEFT) {
        return [left, ...effects.slice(1)]
      }

      return [right, ...effects.slice(1)]
    })
  }
}
