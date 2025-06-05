import { EffectType } from '../../material/effect/EffectType'
import { RuleId } from '../RuleId'

export const EffectRuleIds: Record<EffectType, RuleId> = {
  [EffectType.Transfer]: RuleId.Transfer,
  [EffectType.GiveCredit]: RuleId.GiveCredit,
  [EffectType.WinCredit]: RuleId.WinCredit,
  [EffectType.SpendCredit]: RuleId.SpendCredit,
  [EffectType.Conditional]: RuleId.Conditional,
  [EffectType.WinZenithium]: RuleId.WinZenithium,
  [EffectType.GiveZenithium]: RuleId.GiveZenithium,
  [EffectType.Exile]: RuleId.Exile,
  [EffectType.WinInfluence]: RuleId.WinInfluence,
  [EffectType.GiveInfluence]: RuleId.GiveInfluence,
  [EffectType.ResetInfluence]: RuleId.ResetInfluence,
  [EffectType.DevelopTechnology]: RuleId.DevelopTechnology,
  [EffectType.GiveLeaderBadge]: RuleId.GiveLeaderBadge,
  [EffectType.TakeLeaderBadge]: RuleId.TakeLeaderBadge,
  [EffectType.Discard]: RuleId.Discard,
  [EffectType.Mobilize]: RuleId.Mobilize,
  [EffectType.Choice]: RuleId.Choice,
  [EffectType.TakeBonus]: RuleId.TakeBonus
}
