/** @jsxImportSource @emotion/react */
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Faction } from '@gamepark/zenith/material/Faction'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getFactionForHeader, HeaderTransComponents } from '../i18n/trans.components'
import { MinimizedToast } from '../components/ZenithDialog'
import { DiscardActionDialog } from './DiscardActionDialog'

export const DiscardActionHeader: FC = () => {
  const { t } = useTranslation()
  const rules = useRules<ZenithRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = usePlayerId<PlayerId>() === activePlayer
  const faction = rules.remind<Faction>(Memory.DiscardFaction)
  const name = usePlayerName(activePlayer)
  const [minimized, setMinimized] = useState(false)
  const [chosen, setChosen] = useState(false)
  const components = {
    ...HeaderTransComponents,
    faction: getFactionForHeader(faction)
  }

  if (itsMe) {
    return (
      <>
        <Trans i18nKey="header.discard-action.choose" components={components} />
        {chosen ? null : minimized ? (
          <MinimizedToast title={t('discard-action.minimized')} onClick={() => setMinimized(false)} />
        ) : (
          <DiscardActionDialog onMinimize={() => setMinimized(true)} onChosen={() => setChosen(true)} />
        )}
      </>
    )
  }

  return <Trans i18nKey="header.discard-action.player" values={{ player: name }} components={components} />
}

