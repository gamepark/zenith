import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Choice } from '@gamepark/zenith/rules/effect'
import { FC } from 'react'

export const ChoiceHeader: FC = () => {
  const left = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Choice)(move) && move.data === Choice.LEFT)
  const right = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Choice)(move) && move.data === Choice.RIGHT)

  return (
    <>
      <PlayMoveButton move={left}>Gauche</PlayMoveButton>
      {` OU `}
      <PlayMoveButton move={right}>Droite</PlayMoveButton>
    </>
  )
}
