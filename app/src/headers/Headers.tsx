/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { ComponentType } from 'react'
import { AutoEffectHeader } from './AutoEffectHeader'
import { ChoiceHeader } from './ChoiceHeader'
import { ConditionalHeader } from './ConditionalHeader'
import { DevelopTechnologyHeader } from './DevelopTechnologyHeader'
import { DiscardActionHeader } from './DiscardActionHeader'
import { DiscardHeader } from './DiscardHeader'
import { ExileHeader } from './ExileHeader'
import { GiveInfluenceHeader } from './GiveInfluenceHeader'
import { MuliganHeader } from './MuliganHeader'
import { PickOrderHeader } from './PickOrderHeader'
import { PlayCardHeader } from './PlayCardHeader'
import { ResetInfluenceHeader } from './ResetInfluenceHeader'
import { ShareCardHeader } from './ShareCardHeader'
import { RefillHeader } from './RefillHeader'
import { TakeBonusTokenHeader } from './TakeBonusTokenHeader'
import { TakeLeaderBadgeHeader } from './TakeLeaderBadgeHeader'
import { TakeTechnologyBonusTokenHeader } from './TakeTechnologyBonusTokenHeader'
import { TransfertHeader } from './TransfertHeader'
import { WinCreditHeader } from './WinCreditHeader'
import { WinInfluenceHeader } from './WinInfluenceHeader'
import { WinZenithiumHeader } from './WinZenithiumHeader'

const TechnologyActionHeader = () => <AutoEffectHeader i18nKey="header.technology-action" defaultsMe="You develop technology" defaults="Team {team} develops technology" />
const DiplomacyActionHeader = () => <AutoEffectHeader i18nKey="header.diplomacy-action" defaultsMe="You use diplomacy" defaults="Team {team} uses diplomacy" />
const MobilizeHeader = () => <AutoEffectHeader i18nKey="header.mobilize" defaultsMe="<source /> : You mobilize agents" defaults="<source /> : Team {team} mobilizes agents" />
const StealCreditHeader = () => <AutoEffectHeader i18nKey="header.steal-credit" defaultsMe="<source /> : You steal credits from your opponents" defaults="<source /> : Team {team} steals credits" />
const GiveCreditHeader = () => <AutoEffectHeader i18nKey="header.give-credit" defaultsMe="<source /> : You give credits to your opponents" defaults="<source /> : Team {team} gives credits" />
const SpendCreditHeader = () => <AutoEffectHeader i18nKey="header.spend-credit" defaultsMe="<source /> : You spend credits" defaults="<source /> : Team {team} spends credits" />
const GiveZenithiumHeader = () => <AutoEffectHeader i18nKey="header.give-zenithium" defaultsMe="<source /> : You give zenithium to your opponents" defaults="<source /> : Team {team} gives zenithium" />
const SpendZenithiumHeader = () => <AutoEffectHeader i18nKey="header.spend-zenithium" defaultsMe="<source /> : You spend zenithium" defaults="<source /> : Team {team} spends zenithium" />
const GiveLeaderBadgeHeader = () => <AutoEffectHeader i18nKey="header.give-leader-badge" defaultsMe="<source /> : You give the Leader Badge to your opponents" defaults="<source /> : Team {team} gives the Leader Badge" />

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Muligan]: MuliganHeader,
  [RuleId.PlayCard]: PlayCardHeader,
  [RuleId.DiscardAction]: DiscardActionHeader,
  [RuleId.Transfer]: TransfertHeader,
  [RuleId.GiveCredit]: GiveCreditHeader,
  [RuleId.SpendCredit]: SpendCreditHeader,
  [RuleId.GiveInfluence]: GiveInfluenceHeader,
  [RuleId.ResetInfluence]: ResetInfluenceHeader,
  [RuleId.Conditional]: ConditionalHeader,
  [RuleId.DevelopTechnology]: DevelopTechnologyHeader,
  [RuleId.GiveZenithium]: GiveZenithiumHeader,
  [RuleId.SpendZenithium]: SpendZenithiumHeader,
  [RuleId.Choice]: ChoiceHeader,
  [RuleId.Exile]: ExileHeader,
  [RuleId.TakeBonus]: TakeBonusTokenHeader,
  [RuleId.TakeLeaderBadge]: TakeLeaderBadgeHeader,
  [RuleId.GiveLeaderBadge]: GiveLeaderBadgeHeader,
  [RuleId.WinCredit]: WinCreditHeader,
  [RuleId.WinZenithium]: WinZenithiumHeader,
  [RuleId.WinInfluence]: WinInfluenceHeader,
  [RuleId.Discard]: DiscardHeader,
  [RuleId.Mobilize]: MobilizeHeader,
  [RuleId.StealCredit]: StealCreditHeader,
  [RuleId.TakeTechnologyBonusToken]: TakeTechnologyBonusTokenHeader,
  [RuleId.Refill]: RefillHeader,
  [RuleId.PickOrder]: PickOrderHeader,
  [RuleId.ShareCard]: ShareCardHeader,
  [RuleId.TechnologyAction]: TechnologyActionHeader,
  [RuleId.DiplomacyAction]: DiplomacyActionHeader
}
