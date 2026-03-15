/** @jsxImportSource @emotion/react */
import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ExpandedEffect, SpendCreditEffect } from '@gamepark/zenith/material/effect/Effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { MinimizedToast } from '../../components/ZenithDialog'
import { useDoConditionHeaderContext } from './condition.utils'
import { SpendConditionDialog } from './SpendConditionDialog'

export const SpendCreditHeader = () => {
  const { t } = useTranslation()
  const { itsMe, name } = useDoConditionHeaderContext<SpendCreditEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const [minimized, setMinimized] = useState(false)

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return (
      <>
        <Trans
          i18nKey="header.condition.spend-credits.dialog"
          components={{ ...HeaderTransComponents, source }}
        />
        {minimized ? (
          <MinimizedToast title={t('spend-dialog.minimized.credit')} onClick={() => setMinimized(false)} />
        ) : (
          <SpendConditionDialog type="credit" onMinimize={() => setMinimized(true)} />
        )}
      </>
    )
  }

  return (
    <Trans
      i18nKey="header.condition.spend-credits.player"
      values={{ player: name }}
      components={{ ...HeaderTransComponents, source }}
    />
  )
}

