import { CustomMove, isStartPlayerTurn, isStartRule, ItemMove, MaterialGame, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { RuleMove } from '@gamepark/rules-api/dist/material/moves'
import { RuleStep } from '@gamepark/rules-api/dist/material/rules/RuleStep'
import { PlayMoveContext } from '@gamepark/rules-api/dist/Rules'
import { credits } from '../../material/Credit'
import { ConditionalEffect, Effect, ExpandedEffect } from '../../material/effect/Effect'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor } from '../../TeamColor'
import { getEffectRule } from '../helper/EffectHelper'
import { EffectRuleIds } from '../helper/EffectRuleIds'
import { PlayerHelper } from '../helper/PlayerHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export abstract class EffectRule<E extends Effect = Effect> extends PlayerTurnRule {
  effect: ExpandedEffect<E>

  constructor(game: MaterialGame, effect?: E) {
    super(game)
    this.effect = (effect ?? this.firstEffect) as ExpandedEffect<E>
  }

  onRuleStart(_move?: RuleMove, _previousRule?: RuleStep, _context?: PlayMoveContext) {
    if (!this.isPossible()) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return []
  }

  getAutomaticEffectMoves(): MaterialMove[] {
    return []
  }

  isPossible() {
    return true
  }

  get creditMoney() {
    return this.material(MaterialType.CreditToken).money(credits)
  }

  setExtraData(_extraData: Record<string, unknown>) {}

  decrement(_move: ItemMove | CustomMove) {
    return true
  }

  getExtraDataFromMove(_move: ItemMove | CustomMove): Record<string, unknown> {
    return {
      quantity: 1
    }
  }

  get effects(): ExpandedEffect[] {
    return this.remind<ExpandedEffect[]>(Memory.Effects)
  }

  get firstEffect(): ExpandedEffect | undefined {
    return this.effects[0]
  }

  get playerHelper() {
    return new PlayerHelper(this.game, this.player)
  }

  removeFirstEffect() {
    this.memorize(Memory.Effects, (effects: ExpandedEffect[]) => {
      effects.shift()
      return effects
    })
  }

  applyFirstEffect() {
    const effect = this.firstEffect
    if (!effect) {
      return []
    }

    return [this.startRule(EffectRuleIds[effect.type])]
  }

  afterEffectPlayed() {
    const moves: MaterialMove[] = this.applyFirstEffect()
    if (!moves.some((move) => isStartRule(move) || isStartPlayerTurn(move)) && !this.effects.length) {
      moves.push(this.startRule(RuleId.Refill))
    }
    return moves
  }

  get opponentTeam() {
    return this.playerHelper.team === TeamColor.White ? TeamColor.Black : TeamColor.White
  }

  removeCondition(extraData?: Record<string, unknown>) {
    this.memorize(Memory.Effects, (effects: ExpandedEffect[]) => {
      const firstEffect = effects[0] as ExpandedEffect<ConditionalEffect>
      const { effect } = firstEffect

      if (extraData) {
        getEffectRule(this.game, effect).setExtraData(extraData)
      }

      return [{ ...effect, effectSource: firstEffect.effectSource }, ...effects.slice(1)]
    })
  }
}
