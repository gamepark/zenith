/** @jsxImportSource @emotion/react */
import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ExpandedEffect, isDoEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ExileAtOnceConditionHeader } from './condition/ExileAtOnceConditionHeader'
import { ExileOneConditionHeader } from './condition/ExileOneConditionHeader'
import { GiveCreditHeader } from './condition/GiveCreditHeader'
import { GiveLeaderBadgeHeader } from './condition/GiveLeaderBadgeHeader'
import { GiveZenithiumHeader } from './condition/GiveZenithiumHeader'
import { SpendCreditHeader } from './condition/SpendCreditHeader'
import { SpendZenithiumHeader } from './condition/SpendZenithiumHeader'
import { ExileHeader } from './ExileHeader'

export const ConditionalHeader = () => {
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>

  const condition = effect.condition
  if (isDoEffect(condition)) {
    if (condition.effect.type === EffectType.SpendZenithium) {
      return <SpendZenithiumHeader />
    }

    if (condition.effect.type === EffectType.GiveZenithium) {
      return <GiveZenithiumHeader />
    }

    if (condition.effect.type === EffectType.GiveCredit) {
      return <GiveCreditHeader />
    }

    if (condition.effect.type === EffectType.GiveLeaderBadge) {
      return <GiveLeaderBadgeHeader />
    }

    if (condition.effect.type === EffectType.SpendCredit) {
      return <SpendCreditHeader />
    }

    if (condition.effect.type === EffectType.Exile && !effect.mandatory) {
      return condition.effect.quantities !== undefined ? <ExileAtOnceConditionHeader /> : <ExileOneConditionHeader />
    }

    if (condition.effect.type === EffectType.Exile && effect.mandatory) {
      return <ExileHeader effect={{ ...condition.effect, effectSource: effect.effectSource }} />
    }
  }

  return <>'...'</>
}
