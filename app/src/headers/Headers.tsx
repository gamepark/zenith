/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { ComponentType } from 'react'
import { DiscardActionHeader } from './DiscardActionHeader'
import { MuliganHeader } from './MuliganHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Muligan]: MuliganHeader,
  [RuleId.DiscardAction]: DiscardActionHeader
}
