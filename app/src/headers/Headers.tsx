/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { ComponentType } from 'react'
import { ConditionalHeader } from './ConditionalHeader'
import { DiscardActionHeader } from './DiscardActionHeader'
import { GiveInfluenceHeader } from './GiveInfluenceHeader'
import { MuliganHeader } from './MuliganHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Muligan]: MuliganHeader,
  [RuleId.DiscardAction]: DiscardActionHeader,
  [RuleId.GiveInfluence]: GiveInfluenceHeader,
  [RuleId.Conditional]: ConditionalHeader
}
