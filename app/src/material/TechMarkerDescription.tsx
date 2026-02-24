/** @jsxImportSource @emotion/react */
import { faFlask } from '@fortawesome/free-solid-svg-icons/faFlask'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemContext, ItemMenuButton, TokenDescription } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { Trans } from 'react-i18next'
import Black from '../images/technology-token/black.png'
import White from '../images/technology-token/white.png'
import { TechMarkerHelp } from './TechMarkerHelp'

export class TechMarkerDescription extends TokenDescription {
  help = TechMarkerHelp
  height = 1.3
  width = 1.45
  borderRadius = 1
  menuAlwaysVisible = true
  images = {
    [TeamColor.Black]: Black,
    [TeamColor.White]: White
  }

  transparency = true

  getItemMenu(_item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const move = legalMoves.find(m => isMoveItemType(MaterialType.TechMarker)(m) && m.itemIndex === context.index)
    if (move) {
      return (
        <ItemMenuButton move={move} y={-2} x={0} label={<Trans i18nKey="help.action.develop" />}>
          <FontAwesomeIcon icon={faFlask} />
        </ItemMenuButton>
      )
    }
  }
}

export const techMarkerDescription = new TechMarkerDescription()
