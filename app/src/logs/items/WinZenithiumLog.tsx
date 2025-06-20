/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CreateItem, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { WinZenithiumRule } from '@gamepark/zenith/rules/effect'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TransComponents } from './trans.components'

export const WinZenithiumLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as CreateItem
  const { t } = useTranslation()
  const rules = new WinZenithiumRule(context.game as MaterialGame)
  const count = move.item.quantity ?? 1
  const activePlayer = rules.getActivePlayer()
  const playerName = usePlayerName(activePlayer)

  return (
    <>
      <Trans
        defaults="log.win.zenithium"
        values={{
          player: playerName,
          count: count,
          team: t(`team.${getTeamColor(activePlayer)}`)
        }}
        components={TransComponents}
      />
    </>
  )
}
