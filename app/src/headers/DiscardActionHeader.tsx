/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Faction } from '@gamepark/zenith/material/Faction'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getFactionForHeader, HeaderTransComponents } from '../i18n/trans.components'
import { DiscardActionDialog } from './DiscardActionDialog'

export const DiscardActionHeader: FC = () => {
  const { t } = useTranslation()
  const rules = useRules<ZenithRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = usePlayerId<PlayerId>() === activePlayer
  const faction = rules.remind<Faction>(Memory.DiscardFaction)
  const name = usePlayerName(activePlayer)
  const [minimized, setMinimized] = useState(false)
  const components = {
    ...HeaderTransComponents,
    faction: getFactionForHeader(faction)
  }

  if (itsMe) {
    return (
      <>
        <Trans i18nKey="header.discard-action.choose" components={components} />
        {minimized ? (
          <button css={minimizedButtonCss} onClick={() => setMinimized(false)}>
            {t('discard-action.minimized')} 👁
          </button>
        ) : (
          <DiscardActionDialog onMinimize={() => setMinimized(true)} />
        )}
      </>
    )
  }

  return <Trans i18nKey="header.discard-action.player" values={{ player: name }} components={components} />
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
