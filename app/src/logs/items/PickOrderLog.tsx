/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialMove } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { LogTransComponents } from '../../i18n/trans.components'

export const PickOrderLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move = props.move as CustomMove
  const chosenPlayer: PlayerId = move.data
  const chosenPlayerName = usePlayerName(chosenPlayer)

  // Find the player who made the choice (from the rule's players list, the one who is not chosen might be the chooser)
  const rulePlayers = context.game.rule?.players ?? []
  const chooser = rulePlayers.find(p => p !== chosenPlayer) ?? rulePlayers[0]
  const chooserName = usePlayerName(chooser)

  return (
    <Trans
      i18nKey="log.pick-order"
      values={{
        chooser: chooserName,
        chosen: chosenPlayerName
      }}
      components={LogTransComponents}
    />
  )
}
