import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ExpandedEffect, MobilizeEffect } from '@gamepark/zenith/material/effect/Effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { useDoConditionHeaderContext } from './condition.utils'

export const MobilizeConditionHeader = () => {
  const { itsMe, name } = useDoConditionHeaderContext<MobilizeEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return (
      <Trans
        i18nKey="header.condition.mobilize"
        components={{
          ...HeaderTransComponents,
          source
        }}
      />
    )
  }

  return (
    <Trans
      i18nKey="header.condition.mobilize.player"
      values={{ player: name }}
      components={{
        ...HeaderTransComponents,
        source
      }}
    />
  )
}
