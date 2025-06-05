/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'

export const ConditionalHeader = () => {
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const doIt = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.DoCondition)(move))
  return (
    <>
      <PlayMoveButton move={pass}>Passez</PlayMoveButton>
      <PlayMoveButton move={doIt}>Faire l'effet</PlayMoveButton>
    </>
  )
}
