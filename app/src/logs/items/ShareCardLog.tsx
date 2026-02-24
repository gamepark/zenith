/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const ShareCardLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const activePlayer = rules.getActivePlayer()!
  const playerName = usePlayerName(activePlayer)
  const teammateName = usePlayerName(move.location.player)

  return (
    <Trans
      i18nKey="log.share.card"
      values={{
        player: playerName,
        teammate: teammateName
      }}
    />
  )
}
