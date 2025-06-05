/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'

export const DevelopTechnologyHeader = () => {
  const doIt = useLegalMoves((move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move))
  return (
    <>
      {doIt.map((move, index) => (
        <PlayMoveButton move={move}>{index + 1}</PlayMoveButton>
      ))}
    </>
  )
}
