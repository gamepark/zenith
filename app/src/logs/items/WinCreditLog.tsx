/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { WinCreditRule } from '@gamepark/zenith/rules/effect'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LogTransComponents } from '../../i18n/trans.components'

export const WinCreditLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as CustomMove
  const { t } = useTranslation()
  const rules = new WinCreditRule(context.game as MaterialGame)
  const count = move.data
  const activePlayer = rules.getActivePlayer()
  const playerName = usePlayerName(activePlayer)

  return (
    <>
      <Trans
        defaults="log.win.credit"
        values={{
          player: playerName,
          count: count,
          team: t(`team.${getTeamColor(activePlayer)}`)
        }}
        components={LogTransComponents}
      />
    </>
  )
}
