/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { ShareCardRule } from '@gamepark/zenith/rules/effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'

export const ShareCardHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new ShareCardRule(game)
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const remaining = rules.remind<number>(Memory.ShareCardRemaining)

  if (itsMe) {
    return <Trans i18nKey="header.share-card" values={{ count: remaining }} components={HeaderTransComponents} />
  }
  return <Trans i18nKey="header.share-card.player" values={{ count: remaining, player: name }} components={HeaderTransComponents} />
}
