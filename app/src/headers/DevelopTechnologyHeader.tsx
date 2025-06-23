/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'

export const DevelopTechnologyHeader = () => {
  const doIt = useLegalMoves((move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move))
  const pass = useLegalMoves((move) => isCustomMoveType(CustomMoveType.Pass)(move))
  return (
    <>
      <PlayMoveButton move={pass}>Passer</PlayMoveButton>
      {doIt.map((move, index) => (
        <PlayMoveButton move={move}>{index + 1}</PlayMoveButton>
      ))}
    </>
  )
}
