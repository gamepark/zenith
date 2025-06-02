import { Influence } from '../Influence'
import { EffectType } from './EffectType'

enum ConditionType {
  DoEffect,
  Leader,
  HaveCredits
}

export type LeaderCondition = {
  type: ConditionType.Leader
}
export type HaveCreditsCondition = {
  type: ConditionType.HaveCredits
}

export type DoEffectCondition = {
  type: ConditionType.DoEffect
  effect: Effect
}

type Condition = DoEffectCondition | LeaderCondition | HaveCreditsCondition

export type ConditionalEffect = {
  type: EffectType.Conditional
  mandatory?: boolean
  condition: Condition
  effect: Effect
}

export type StealCreditEffect = {
  type: EffectType.StealCredit
  quantity?: number
}

export type WinCreditEffect = {
  type: EffectType.WinCredit
  quantity?: number
}

export type GiveCreditEffect = {
  type: EffectType.GiveCredit
  quantity?: number
}

export type TransferEffect = {
  type: EffectType.TransferCard
}

export type WinZenithiumEffect = {
  type: EffectType.WinZenithium
  quantity?: number
}

export type ExileEffect = {
  type: EffectType.Exile
}

export type WinInfluenceEffect = {
  type: EffectType.WinInfluence
  influence?: Influence
  quantity?: number
  differentPlanets?: boolean
  neighbor?: boolean
  opponentSide?: boolean
}

export type GiveInfluenceEffect = {
  type: EffectType.GiveInfluence
}

export type ResetInfluenceEffect = {
  type: EffectType.ResetInfluence
}

export type DevelopTechnologyEffect = {
  type: EffectType.DevelopTechnology
}

export type GiveLeaderBadgeEffect = {
  type: EffectType.GiveLeaderBadge
}

export type TakeLeaderBadgeEffect = {
  type: EffectType.TakeLeaderBadge
}

export type DiscardEffect = {
  type: EffectType.Discard
}

export type MobilizeEffect = {
  type: EffectType.Mobilize
}

export type ChoiceEffect = {
  left: Effect
  right: Effect
}

export type Effect =
  | ConditionalEffect
  | StealCreditEffect
  | WinCreditEffect
  | GiveCreditEffect
  | TransferEffect
  | WinZenithiumEffect
  | ExileEffect
  | WinInfluenceEffect
  | GiveInfluenceEffect
  | ResetInfluenceEffect
  | DevelopTechnologyEffect
  | GiveLeaderBadgeEffect
  | TakeLeaderBadgeEffect
  | DiscardEffect
  | MobilizeEffect
  | ChoiceEffect
