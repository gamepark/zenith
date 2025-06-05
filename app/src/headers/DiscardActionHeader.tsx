import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { FC } from 'react'

export const DiscardActionHeader: FC = () => {
  const diplomacy = useLegalMove(isCustomMoveType(CustomMoveType.Diplomacy))
  const tech = useLegalMove(isMoveItemType(MaterialType.TechMarker))

  return (
    <>
      <PlayMoveButton move={tech}>Avancer la technologie</PlayMoveButton>
      {` OU `}
      <PlayMoveButton move={diplomacy}>Diplomacy</PlayMoveButton>
    </>
  )
}
