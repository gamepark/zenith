import { CustomMove, isCustomMoveType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Condition, ConditionalEffect, ConditionType, DoEffectCondition, Effect, HaveCreditsCondition, LeaderCondition } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { CustomMoveType } from '../CustomMoveType'
import { getEffectRule } from '../helper/EffectHelper'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class ConditionalRule extends EffectRule<ConditionalEffect> {
  onRuleStart() {
    const condition = this.effect.condition
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves

    if (this.isDoCondition(condition) && this.effect.mandatory) {
      moves.push(...getEffectRule(this.game, condition.effect).getAutomaticEffectMoves())
      return moves
    }

    if (this.isLeaderCondition(condition) || this.isHaveCreditCondition(condition)) {
      this.removeCondition()
      return this.afterEffectPlayed()
    }

    return []
  }

  getPlayerMoves() {
    const condition = this.effect.condition
    if (this.isDoCondition(condition)) {
      if (!this.isAutomaticEffect) {
        const moves: MaterialMove[] = []
        if (!this.effect.mandatory && !this.remind(Memory.CantPass)) moves.push(this.customMove(CustomMoveType.Pass))
        moves.push(...getEffectRule(this.game, condition.effect).getPlayerMoves())
        return moves
      }

      return [this.customMove(CustomMoveType.Pass), this.customMove(CustomMoveType.DoCondition)]
    }

    return []
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (isCustomMoveType(CustomMoveType.Pass)(move)) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    if (isCustomMoveType(CustomMoveType.DoCondition)(move)) {
      const condition = this.effect.condition as DoEffectCondition
      if (!this.isDoCondition(condition)) return []
      const conditionEffect = getEffectRule(this.game, condition.effect)
      const extraData = conditionEffect.getExtraDataFromMove(move)
      this.addEffectAndRemoveCondition(extraData)
      return this.afterEffectPlayed()
    }

    this.onEffectPlayed(move)

    const condition = this.effect.condition
    if (this.isDoCondition(condition)) {
      const moves: MaterialMove[] = getEffectRule(this.game, condition.effect).onCustomMove(move)
      moves.push(...this.afterEffectPlayed())
      return moves
    }

    return []
  }

  afterItemMove(move: ItemMove) {
    const done = this.onEffectPlayed(move)
    if (done) {
      return this.afterEffectPlayed()
    }

    return []
  }

  onEffectPlayed(move: ItemMove | CustomMove) {
    const condition = this.effect.condition
    if (this.isDoCondition(condition)) {
      if (this.isAutomaticEffect) return
      const conditionEffect = getEffectRule(this.game, condition.effect)
      const done = conditionEffect.decrement(move)
      if (done) {
        const extraData = conditionEffect.getExtraDataFromMove(move)
        this.removeCondition(extraData)
      } else {
        this.memorize(Memory.CantPass, true)
      }
      return done
    }

    return true
  }

  get isAutomaticEffect() {
    const condition = this.effect.condition
    if (!this.isDoCondition(condition)) return false
    return condition.effect.type === EffectType.GiveCredit || condition.effect.type === EffectType.GiveZenithium
  }

  isDoCondition(condition: Condition): condition is DoEffectCondition {
    return condition.type === ConditionType.DoEffect
  }

  isLeaderCondition(condition: Condition): condition is LeaderCondition {
    return condition.type === ConditionType.Leader
  }

  isHaveCreditCondition(condition: Condition): condition is HaveCreditsCondition {
    return condition.type === ConditionType.HaveCredits
  }

  isPossible() {
    const condition = this.effect.condition
    if (this.isDoCondition(condition)) {
      const conditionEffect = getEffectRule(this.game, condition.effect)

      return conditionEffect.isPossible() && getEffectRule(this.game, this.effect.effect).isPossible()
    }

    if (this.isLeaderCondition(condition)) {
      return this.playerHelper.isLeader
    }

    if (this.isHaveCreditCondition(condition)) {
      return this.playerHelper.credits >= condition.min
    }

    return false
  }

  addEffectAndRemoveCondition(extraData?: Record<string, unknown>) {
    this.memorize(Memory.Effects, (effects: Effect[]) => {
      const firstEffect = effects[0] as ConditionalEffect
      const { condition, effect } = firstEffect

      if (extraData) {
        getEffectRule(this.game, effect).setExtraData(extraData)
      }

      return [(condition as DoEffectCondition).effect, effect, ...effects.slice(1)]
    })
  }

  onRuleEnd() {
    this.forget(Memory.CantPass)
    return []
  }
}
