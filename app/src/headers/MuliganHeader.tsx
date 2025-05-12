/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'

export const MuliganHeader = () => {
  const endTurn = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  return (
    <>
      Muligan ou <PlayMoveButton move={endTurn}>Passez</PlayMoveButton>
    </>
  )
}
