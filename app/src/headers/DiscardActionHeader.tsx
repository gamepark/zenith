import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Faction } from '@gamepark/zenith/material/Faction'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { getFactionForHeader, HeaderTransComponents } from '../i18n/trans.components'
import { DiscardActionDialog } from './DiscardActionDialog'

export const DiscardActionHeader: FC = () => {
  const rules = useRules<ZenithRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = usePlayerId<PlayerId>() === activePlayer
  const faction = rules.remind<Faction>(Memory.DiscardFaction)
  const name = usePlayerName(activePlayer)
  const components = {
    ...HeaderTransComponents,
    faction: getFactionForHeader(faction)
  }

  if (itsMe) {
    return (
      <>
        <Trans i18nKey="header.discard-action.choose" components={components} />
        <DiscardActionDialog onClose={() => {}} />
      </>
    )
  }

  return <Trans i18nKey="header.discard-action.player" values={{ player: name }} components={components} />
}
