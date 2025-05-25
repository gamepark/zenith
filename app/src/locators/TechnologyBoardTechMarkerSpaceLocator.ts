import { Locator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor } from '@gamepark/zenith/TeamColor'

export class TechnologyBoardTechMarkerSpaceLocator extends Locator {
  parentItemType = MaterialType.TechnologyBoard

  getPositionOnParent(location: Location, context: MaterialContext): XYCoordinates {
    const item = this.getParentItem(location, context)

    if (TeamColor.Black === location.player) {
      if (item?.location.id === 3) return { x: 83, y: 94.5 }
      if (item?.location.id === 2) return { x: 79.5, y: 94.5 }
      return { x: 66, y: 94.5 }
    }

    if (item?.location.id === 3) return { x: 34, y: 94.5 }
    if (item?.location.id === 2) return { x: 20.5, y: 94.5 }
    return { x: 17, y: 94.5 }
  }
}

export const technologyBoardTechMarkerSpaceLocator = new TechnologyBoardTechMarkerSpaceLocator()
