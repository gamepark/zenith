/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'

export const GiveInfluenceHeader = () => {
  const endTurn = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  return (
    <>
      <PlayMoveButton move={endTurn}>Ignorer</PlayMoveButton>
    </>
  )
}
