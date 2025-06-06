import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { Effect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { PlayerId } from '../../PlayerId'
import {
  ChoiceRule,
  ConditionalRule,
  DevelopTechnologyRule,
  DiscardRule,
  EffectRule,
  ExileRule,
  GiveCreditRule,
  GiveInfluenceRule,
  GiveLeaderBadgeRule,
  GiveZenithiumRule,
  MobilizeRule,
  ResetInfluenceRule,
  SpendCreditRule,
  TakeBonusRule,
  TakeLeaderBadgeRule,
  TransferRule,
  WinCreditRule,
  WinInfluenceRule,
  WinZenithiumRule
} from '../effect'
import { SpendZenithiumRule } from '../effect/SpendZenithiumRule'
import { StealCreditRule } from '../effect/StealCreditRule'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'
import { EffectRuleIds } from './EffectRuleIds'

export class EffectHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly player: PlayerId
  ) {
    super(game)
  }

  applyCard(item: MaterialItem) {
    const agent = Agents[item.id as Agent]
    this.memorize(Memory.Effects, JSON.parse(JSON.stringify(agent.effects)))
    return this.applyFirstEffect()
  }

  applyFirstEffect() {
    const effect = this.effect
    if (!effect) {
      return []
    }

    return [this.startRule(this.effectRuleIds[effect.type])]
  }

  get effect(): Effect | undefined {
    const effects = this.effects
    return effects[0]
  }

  get effects(): Effect[] {
    return this.remind<Effect[]>(Memory.Effects)
  }

  get effectRuleIds(): Record<EffectType, RuleId> {
    return EffectRuleIds
  }
}

export const getEffectRule = (game: MaterialGame, effect: Effect): EffectRule => {
  switch (effect.type) {
    case EffectType.ResetInfluence:
      return new ResetInfluenceRule(game, effect)
    case EffectType.WinCredit:
      return new WinCreditRule(game, effect)
    case EffectType.SpendCredit:
      return new SpendCreditRule(game, effect)
    case EffectType.WinZenithium:
      return new WinZenithiumRule(game, effect)
    case EffectType.GiveZenithium:
      return new GiveZenithiumRule(game, effect)
    case EffectType.Exile:
      return new ExileRule(game, effect)
    case EffectType.DevelopTechnology:
      return new DevelopTechnologyRule(game, effect)
    case EffectType.GiveLeaderBadge:
      return new GiveLeaderBadgeRule(game, effect)
    case EffectType.TakeLeaderBadge:
      return new TakeLeaderBadgeRule(game, effect)
    case EffectType.Discard:
      return new DiscardRule(game, effect)
    case EffectType.Mobilize:
      return new MobilizeRule(game, effect)
    case EffectType.Choice:
      return new ChoiceRule(game, effect)
    case EffectType.TakeBonus:
      return new TakeBonusRule(game, effect)
    case EffectType.GiveInfluence:
      return new GiveInfluenceRule(game, effect)
    case EffectType.WinInfluence:
      return new WinInfluenceRule(game, effect)
    case EffectType.Conditional:
      return new ConditionalRule(game, effect)
    case EffectType.Transfer:
      return new TransferRule(game, effect)
    case EffectType.GiveCredit:
      return new GiveCreditRule(game, effect)
    case EffectType.StealCredit:
      return new StealCreditRule(game, effect)
    case EffectType.SpendZenithium:
      return new SpendZenithiumRule(game, effect)
  }
}
