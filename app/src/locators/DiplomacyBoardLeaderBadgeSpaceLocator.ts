import { Locator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { diplomacyBoardDescription } from '../material/DiplomacyBoardDescription'

export class DiplomacyBoardLeaderBadgeSpaceLocator extends Locator {
  parentItemType = MaterialType.DiplomacyBoard

  getParentItem(_location: Location, context: MaterialContext): MaterialItem | undefined {
    return diplomacyBoardDescription.getStaticItems(context)[0]
  }

  positionOnParent = { x: 50, y: 26 }
}

export const diplomacyBoardLeaderBadgeSpaceLocator = new DiplomacyBoardLeaderBadgeSpaceLocator()
