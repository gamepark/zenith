/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
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

  getItemExtraCss(item: MaterialItem) {
    if (item.id === TeamColor.White) return whiteTokenCss
    return blackTokenCss
  }

  getItemMenu(_item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const move = legalMoves.find(m => isMoveItemType(MaterialType.TechMarker)(m) && m.itemIndex === context.index)
    if (!move) return
    const firstIndex = legalMoves.find(m => isMoveItemType(MaterialType.TechMarker)(m))
    const isFirst = isMoveItemType(MaterialType.TechMarker)(firstIndex!) && firstIndex.itemIndex === context.index
    return (
      <ItemMenuButton move={move} y={-2} x={0} label={isFirst ? <Trans i18nKey="help.action.develop" /> : undefined} labelPosition="left">
        <FontAwesomeIcon icon={faFlask} />
      </ItemMenuButton>
    )
  }
}

const whiteTokenCss = css`
  filter:
    drop-shadow(0 0 3px rgba(160, 160, 170, 0.5))
    drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
`

const blackTokenCss = css`
  filter:
    drop-shadow(0 0 3px rgba(30, 30, 35, 0.5))
    drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
`

export const techMarkerDescription = new TechMarkerDescription()
