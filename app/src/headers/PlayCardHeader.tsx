/** @jsxImportSource @emotion/react */
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { Trans } from 'react-i18next'
import { TransComponents } from '../i18n/trans.components'

export const PlayCardHeader = () => {
  const rules = useRules<ZenithRules>()!
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)

  if (itsMe) {
    return <Trans defaults="header.play" />
  }

  return <Trans defaults="header.play.other" values={{ player: name }} components={TransComponents} />
}
