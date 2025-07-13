import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { getFactionForHeader, HeaderTransComponents } from '../i18n/trans.components'

export const DiscardActionHeader: FC = () => {
  const diplomacy = useLegalMove(isCustomMoveType(CustomMoveType.Diplomacy))
  const tech = useLegalMove(isMoveItemType(MaterialType.TechMarker))
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
      <Trans
        defaults="header.discard-action"
        components={{
          ...components,
          technology: <PlayMoveButton move={tech} />,
          diplomacy: <PlayMoveButton move={diplomacy} />
        }}
      />
    )
  }

  return <Trans defaults="header.discard-action.player" values={{ player: name }} components={components} />
}
