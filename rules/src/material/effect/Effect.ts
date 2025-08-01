import { Faction } from '../Faction'
import { Influence } from '../Influence'
import { MaterialType } from '../MaterialType'
import { EffectType } from './EffectType'

export enum ConditionType {
  DoEffect,
  Leader,
  HaveCredits
}

export type LeaderCondition = {
  type: ConditionType.Leader
}
export type HaveCreditsCondition = {
  type: ConditionType.HaveCredits
  min: number
}

export type DoEffectCondition = {
  type: ConditionType.DoEffect
  effect: Effect
}

export type Condition = DoEffectCondition | LeaderCondition | HaveCreditsCondition

export type ConditionalEffect = {
  type: EffectType.Conditional
  mandatory?: boolean
  condition: Condition
  effect: Effect
}

export type SpendCreditEffect = {
  type: EffectType.SpendCredit
  factors: number[]
  quantities: number[]
  quantity?: number
}

export type SpendZenithiumEffect = {
  type: EffectType.SpendZenithium
  factors: number[]
  quantities: number[]
  quantity?: number
}

export type WinCreditEffect = {
  type: EffectType.WinCredit
  quantity?: number
  factorPerDifferentOpponentInfluence?: number
  factorPerDifferentInfluence?: number
  perLevel1Technology?: number[]
  opponent?: boolean
}

export type GiveCreditEffect = {
  type: EffectType.GiveCredit
  quantity: number
}

export type StealCreditEffect = {
  type: EffectType.StealCredit
  quantity: number
}

export type TransferEffect = {
  type: EffectType.Transfer
  influence?: Influence
  quantity?: number
}

export type WinZenithiumEffect = {
  type: EffectType.WinZenithium
  quantity?: number
  opponent?: boolean
  perLevel1Technology?: number[]
}

export type TakeBonusEffect = {
  type: EffectType.TakeBonus
  visible?: boolean
}

export type GiveZenithiumEffect = {
  type: EffectType.GiveZenithium
  quantity?: number
}

export type ExileEffect = {
  type: EffectType.Exile
  factors?: number[]
  quantity?: number
  except?: Influence
  quantities?: number[]
  opponent?: boolean
  influence?: Influence
}

export type WinInfluenceEffect = {
  type: EffectType.WinInfluence
  except?: Influence
  influence?: Influence
  // Forced quantity
  quantity?: number
  pattern?: number[]
  // Number of time the effect can be played
  times?: number
  resetDifferentPlanet?: boolean
  differentPlanet?: boolean
  fromCenter?: boolean
  opponentSide?: boolean
}

export type GiveInfluenceEffect = {
  type: EffectType.GiveInfluence
  except?: Influence
}

export type ResetInfluenceEffect = {
  type: EffectType.ResetInfluence
}

export type DevelopTechnologyEffect = {
  type: EffectType.DevelopTechnology
  free?: boolean
  lowest?: boolean
  discount?: number
  faction?: Faction
  optional?: boolean
}

export type GiveLeaderBadgeEffect = {
  type: EffectType.GiveLeaderBadge
}

export type TakeLeaderBadgeEffect = {
  type: EffectType.TakeLeaderBadge
  gold?: boolean
}

export type DiscardEffect = {
  type: EffectType.Discard
  full?: boolean
}

export type MobilizeEffect = {
  type: EffectType.Mobilize
  quantity?: number
}

export type ChoiceEffect = {
  type: EffectType.Choice
  left: Effect
  right: Effect
}

export type TakeTechnologyBonusToken = {
  type: EffectType.TakeTechnologyBonusToken
  faction: Faction
  x: number
}

export type Effect =
  | ConditionalEffect
  | WinCreditEffect
  | SpendCreditEffect
  | GiveCreditEffect
  | TransferEffect
  | WinZenithiumEffect
  | GiveZenithiumEffect
  | SpendZenithiumEffect
  | StealCreditEffect
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
  | TakeBonusEffect
  | TakeTechnologyBonusToken

export type ExpandedEffect<T extends Effect = Effect> = T & {
  effectSource: {
    type: MaterialType
    value: unknown
  }
}

export const isSpendZenithium = (effect: Effect): effect is SpendZenithiumEffect => effect.type === EffectType.SpendZenithium
export const isDoEffect = (condition: Condition): condition is DoEffectCondition => condition.type === ConditionType.DoEffect
