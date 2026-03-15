/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { GiveZenithiumRule } from '@gamepark/zenith/rules/effect'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LogTransComponents } from '../../i18n/trans.components'

export const GiveZenithiumLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as CustomMove
  const { t } = useTranslation()
  const rules = new GiveZenithiumRule(context.game as MaterialGame)
  const count = move.data
  const activePlayer = rules.getActivePlayer()
  const playerName = usePlayerName(activePlayer)

  return (
    <Trans
      i18nKey="log.give.zenithium"
      values={{
        player: playerName,
        count: count,
        team: t(`team.${new PlayerHelper(context.game as MaterialGame, activePlayer).team}`)
      }}
      components={LogTransComponents}
    />
  )
}
