/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { ComponentType } from 'react'
import { ChoiceHeader } from './ChoiceHeader'
import { ConditionalHeader } from './ConditionalHeader'
import { DevelopTechnologyHeader } from './DevelopTechnologyHeader'
import { DiscardActionHeader } from './DiscardActionHeader'
import { GiveInfluenceHeader } from './GiveInfluenceHeader'
import { MuliganHeader } from './MuliganHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Muligan]: MuliganHeader,
  [RuleId.DiscardAction]: DiscardActionHeader,
  [RuleId.GiveInfluence]: GiveInfluenceHeader,
  [RuleId.Conditional]: ConditionalHeader,
  [RuleId.DevelopTechnology]: DevelopTechnologyHeader,
  [RuleId.Choice]: ChoiceHeader
}
