import { Locator } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'

export class DiplomacyBoardLeaderBadgeSpaceLocator extends Locator {
  parentItemType = MaterialType.DiplomacyBoard

  positionOnParent = { x: 50, y: 26 }
}

export const diplomacyBoardLeaderBadgeSpaceLocator = new DiplomacyBoardLeaderBadgeSpaceLocator()
