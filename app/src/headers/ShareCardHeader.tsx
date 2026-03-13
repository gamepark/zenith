/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'

export const ShareCardHeader = () => {
  const rules = useRules<ZenithRules>()!
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const remaining = rules.remind<number>(Memory.ShareCardRemaining)
  const passMove = useLegalMove(isCustomMoveType(CustomMoveType.Pass))

  if (itsMe) {
    return <Trans i18nKey="header.share-card" values={{ count: remaining }} components={{ ...HeaderTransComponents, pass: <PlayMoveButton move={passMove} /> }} />
  }
  return <Trans i18nKey="header.share-card.player" values={{ count: remaining, player: name }} components={HeaderTransComponents} />
}
