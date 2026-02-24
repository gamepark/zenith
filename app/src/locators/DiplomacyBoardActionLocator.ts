import { LocationDescription, Locator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location, MaterialItem, XYCoordinates } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { diplomacyBoardDescription } from '../material/DiplomacyBoardDescription'

class DiplomacyBoardActionLocator extends Locator {
  parentItemType = MaterialType.DiplomacyBoard
  locationDescription = new LocationDescription({
    height: 5.5, width: 5, borderRadius: 0.4
  })

  getParentItem(_location: Location, context: MaterialContext): MaterialItem | undefined {
    return diplomacyBoardDescription.getStaticItems(context)[0]
  }

  getPositionOnParent(location: Location): XYCoordinates {
    switch (location.id) {
      case Faction.Robot:
        return { x: 21, y: 84 }
      case Faction.Human:
        return { x: 50, y: 84 }
      case Faction.Animod:
        return { x: 79, y: 84 }
      default:
        return { x: 50, y: 84 }
    }
  }
}

export const diplomacyBoardActionLocator = new DiplomacyBoardActionLocator()
