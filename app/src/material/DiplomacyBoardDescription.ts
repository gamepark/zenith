import { BoardDescription } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import Diplomacy2Players from '../images/diplomacy-board/Diplomacy2Players.png'
import Diplomacy4Players from '../images/diplomacy-board/Diplomacy4Players.png'

export class DiplomacyBoardDescription extends BoardDescription {
  height = 12.6
  width = 20.92

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

  isFlipped(_item: MaterialItem, context: MaterialContext) {
    return context.rules.players.length === 4
  }
}

export const diplomacyBoardDescription = new DiplomacyBoardDescription()
