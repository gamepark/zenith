/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { ComponentType } from 'react'
import { ChoiceHeader } from './ChoiceHeader'
import { ConditionalHeader } from './ConditionalHeader'
import { DevelopTechnologyHeader } from './DevelopTechnologyHeader'
import { DiscardActionHeader } from './DiscardActionHeader'
import { DiscardHeader } from './DiscardHeader'
import { ExileHeader } from './ExileHeader'
import { GiveInfluenceHeader } from './GiveInfluenceHeader'
import { MuliganHeader } from './MuliganHeader'
import { PlayCardHeader } from './PlayCardHeader'
import { RefillHeader } from './RefillHeader'
import { TakeBonusTokenHeader } from './TakeBonusTokenHeader'
import { TakeLeaderBadgeHeader } from './TakeLeaderBadgeHeader'
import { TakeTechnologyBonusTokenHeader } from './TakeTechnologyBonusTokenHeader'
import { TransfertHeader } from './TransfertHeader'
import { WinCreditHeader } from './WinCreditHeader'
import { WinInfluenceHeader } from './WinInfluenceHeader'
import { WinZenithiumHeader } from './WinZenithiumHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Muligan]: MuliganHeader,
  [RuleId.PlayCard]: PlayCardHeader,
  [RuleId.DiscardAction]: DiscardActionHeader,
  [RuleId.Transfer]: TransfertHeader,
  [RuleId.GiveInfluence]: GiveInfluenceHeader,
  [RuleId.Conditional]: ConditionalHeader,
  [RuleId.DevelopTechnology]: DevelopTechnologyHeader,
  [RuleId.Choice]: ChoiceHeader,
  [RuleId.Exile]: ExileHeader,
  [RuleId.TakeBonus]: TakeBonusTokenHeader,
  [RuleId.TakeLeaderBadge]: TakeLeaderBadgeHeader,
  [RuleId.WinCredit]: WinCreditHeader,
  [RuleId.WinZenithium]: WinZenithiumHeader,
  [RuleId.WinInfluence]: WinInfluenceHeader,
  [RuleId.Discard]: DiscardHeader,
  [RuleId.TakeTechnologyBonusToken]: TakeTechnologyBonusTokenHeader,
  [RuleId.Refill]: RefillHeader
}
