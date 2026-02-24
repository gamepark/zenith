/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useRules } from '@gamepark/react-game'
import { ConditionalEffect, ExileEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { useDoConditionHeaderContext } from './condition.utils'
import { ExileAtOnceConditionDialog } from './ExileAtOnceConditionDialog'

export const ExileAtOnceConditionHeader = () => {
  const { t } = useTranslation()
  const { itsMe, name } = useDoConditionHeaderContext<ExileEffect>()
  const rules = useRules<ZenithRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const [minimized, setMinimized] = useState(false)

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
        {minimized ? (
          <button css={minimizedButtonCss} onClick={() => setMinimized(false)}>
            {t('exile-dialog.minimized')}
          </button>
        ) : (
          <ExileAtOnceConditionDialog onMinimize={() => setMinimized(true)} />
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

const pulseKeyframes = css`
  @keyframes minimizedPulse {
    0%, 100% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 0 rgba(74, 85, 104, 0.4);
    }
    50% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(74, 85, 104, 0.15);
    }
  }
`

const minimizedButtonCss = css`
  ${pulseKeyframes}
  position: fixed;
  bottom: 1em;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.4em 1em;
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
  border: 1px solid #d4c8b8;
  border-radius: 0.4em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  color: #4a5568;
  font-size: 0.85em;
  font-weight: 500;
  z-index: 100;
  animation: minimizedPulse 1.2s ease-in-out infinite;

  &:hover {
    animation: none;
    background: linear-gradient(135deg, #fff 0%, #faf8f5 100%);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
  }
`
