/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { WinCreditRule } from '@gamepark/zenith/rules/effect'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LogTransComponents } from '../../i18n/trans.components'

export const WinCreditLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as CustomMove
  const { t } = useTranslation()
  const game = context.game as MaterialGame
  const rules = new WinCreditRule(game)
  const activePlayer = rules.getActivePlayer()
  const playerName = usePlayerName(activePlayer)
  const count = typeof move.data === 'number' ? move.data : move.data.count
  const targetTeam = typeof move.data === 'number' ? new PlayerHelper(game, activePlayer).team : move.data.team

  return (
    <>
      <Trans
        i18nKey="log.win.credit"
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
