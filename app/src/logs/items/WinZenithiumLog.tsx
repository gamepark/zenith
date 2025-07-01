/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CreateItem, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { ExpandedEffect, WinZenithiumEffect } from '@gamepark/zenith/material/effect/Effect'
import { WinZenithiumRule } from '@gamepark/zenith/rules/effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LogTransComponents } from '../../i18n/trans.components'

export const WinZenithiumLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as CreateItem
  const { t } = useTranslation()
  const rules = new WinZenithiumRule(context.game as MaterialGame)
  const count = move.item.quantity ?? 1
  const activePlayer = rules.getActivePlayer()
  const playerName = usePlayerName(activePlayer)
  const effect = rules.remind<ExpandedEffect<WinZenithiumEffect>>(Memory.CurrentEffect as number)

  const activeTeam = getTeamColor(activePlayer)
  const targetTeam = effect.opponent ? rules.opponentTeam : activeTeam

  return (
    <>
      <Trans
        defaults="log.win.zenithium"
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
