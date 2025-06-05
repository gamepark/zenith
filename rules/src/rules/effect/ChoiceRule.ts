import { ChoiceEffect } from '../../material/effect/Effect'
import { EffectRule } from './index'

export class ChoiceRule extends EffectRule<ChoiceEffect> {
  getPlayerMoves() {
    return []
  }
}
