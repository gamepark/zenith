import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'

export class TechnologyBoardBonusSpaceLocator extends Locator {
  parentItemType = MaterialType.TechnologyBoard

  getPositionOnParent(location: Location, context: MaterialContext): XYCoordinates {
    const item = this.getParentItem(location, context)!
    let coordinates = { x: 50, y: 70 }
    if (item.location.id === Faction.Animod) coordinates = { x: 58, y: 64.2 }
    if (item.location.id === Faction.Human) coordinates = { x: 50, y: 64.2 }
    if (item.location.id === Faction.Robot) coordinates = { x: 42, y: 64.2 }

    return coordinates
  }
}

export const technologyBoardBonusSpaceLocator = new TechnologyBoardBonusSpaceLocator()
