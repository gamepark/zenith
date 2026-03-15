/** @jsxImportSource @emotion/react */
import { useRules } from '@gamepark/react-game'
import { ConditionalEffect, ExileEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { MinimizedToast } from '../../components/ZenithDialog'
import { useDoConditionHeaderContext } from './condition.utils'
import { ExileAtOnceConditionDialog } from './ExileAtOnceConditionDialog'

export const ExileAtOnceConditionHeader = () => {
  const { t } = useTranslation()
  const { itsMe, name } = useDoConditionHeaderContext<ExileEffect>()
  const rules = useRules<ZenithRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const [minimized, setMinimized] = useState(false)
  const [chosen, setChosen] = useState(false)

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return (
      <>
        <Trans
          i18nKey="header.condition.exile-at-once.dialog"
          components={{
            ...HeaderTransComponents,
            source
          }}
        />
        {chosen ? null : minimized ? (
          <MinimizedToast title={t('exile-dialog.minimized')} onClick={() => setMinimized(false)} />
        ) : (
          <ExileAtOnceConditionDialog onMinimize={() => setMinimized(true)} onChosen={() => setChosen(true)} />
        )}
      </>
    )
  }

  return (
    <Trans
      i18nKey="header.condition.exile-at-once.player"
      values={{ player: name }}
      components={{
        ...HeaderTransComponents,
        source
      }}
    />
  )
}

