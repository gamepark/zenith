/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CreateItem, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LogTransComponents } from '../../i18n/trans.components'

export const WinZenithiumLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as CreateItem
  const { t } = useTranslation()
  const count = move.item.quantity ?? 1
  const game = context.game as MaterialGame
  const activePlayer = game.rule!.player!
  const playerName = usePlayerName(activePlayer)
  const targetTeam = move.item.location?.player ?? new PlayerHelper(game, activePlayer).team

  return (
    <>
      <Trans
        i18nKey="log.win.zenithium"
        values={{
          player: playerName,
          count: count,
          team: t(`team.${targetTeam}`)
        }}
        components={LogTransComponents}
      />
    </>
  )
}
