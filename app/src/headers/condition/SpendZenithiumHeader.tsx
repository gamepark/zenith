/** @jsxImportSource @emotion/react */
import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ExpandedEffect, SpendZenithiumEffect } from '@gamepark/zenith/material/effect/Effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { MinimizedToast } from '../../components/ZenithDialog'
import { useDoConditionHeaderContext } from './condition.utils'
import { SpendConditionDialog } from './SpendConditionDialog'

export const SpendZenithiumHeader = () => {
  const { t } = useTranslation()
  const { itsMe, name } = useDoConditionHeaderContext<SpendZenithiumEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const [minimized, setMinimized] = useState(false)
  const [chosen, setChosen] = useState(false)

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return (
      <>
        <Trans
          i18nKey="header.condition.spend-zenithium.dialog"
          components={{ ...HeaderTransComponents, source }}
        />
        {chosen ? null : minimized ? (
          <MinimizedToast title={t('spend-dialog.minimized.zenithium')} onClick={() => setMinimized(false)} />
        ) : (
          <SpendConditionDialog type="zenithium" onMinimize={() => setMinimized(true)} onChosen={() => setChosen(true)} />
        )}
      </>
    )
  }

  return (
    <Trans
      i18nKey="header.condition.spend-zenithium.player"
      values={{ player: name }}
      components={{ ...HeaderTransComponents, source }}
    />
  )
}

