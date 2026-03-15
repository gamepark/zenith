import { css, Interpolation, Theme } from '@emotion/react'
import { BoardDescription, ItemContext } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import Diplomacy2Players from '../images/diplomacy-board/Diplomacy2Players.png'
import Diplomacy4Players from '../images/diplomacy-board/Diplomacy4Players.png'
import { DiplomacyBoardHelp } from './DiplomacyBoardHelp'

export class DiplomacyBoardDescription extends BoardDescription {
  help = DiplomacyBoardHelp
  height = 12.35
  width = 20.5

  transparency = true

  image = Diplomacy2Players
  backImage = Diplomacy4Players

  getStaticItems(context: MaterialContext): MaterialItem[] {
    return [
      {
        location: {
          type: LocationType.DiplomacyBoardPlace,
          rotation: context.rules.players.length === 4
        }
      }
    ]
  }

  getFrontExtraCss(): Interpolation<Theme> {
    return dropShadowCss
  }

  getBackExtraCss(): Interpolation<Theme> {
    return dropShadowCss
  }

  isFlipped(_item: MaterialItem, context: MaterialContext) {
    return context.rules.players.length === 4
  }
}

const dropShadowCss = css`
  filter: drop-shadow(0 0 0.05em rgba(0, 0, 0, 0.5)) drop-shadow(0 0 0.05em rgba(0, 0, 0, 0.3));
`

export const diplomacyBoardDescription = new DiplomacyBoardDescription()
