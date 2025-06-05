/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'

export const DevelopTechnologyHeader = () => {
  const doIt = useLegalMove((move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move))
  return (
    <>
      <PlayMoveButton move={doIt}>Développer</PlayMoveButton>
    </>
  )
}
