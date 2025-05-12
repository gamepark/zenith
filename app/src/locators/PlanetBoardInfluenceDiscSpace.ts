import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { planetBoardDescription } from '../material/PlanetBoardDescription'

export class PlanetBoardInfluenceDiscSpace extends Locator {
  parentItemType = MaterialType.PlanetBoard

  getParentItem() {
    return planetBoardDescription.staticItem
  }

  getPositionOnParent(location: Location<PlayerId, LocationType, Influence>, _context: MaterialContext): XYCoordinates {
    switch (location.id) {
      case Influence.Mercury:
        return { x: 12.5, y: 50 }
      case Influence.Venus:
        return { x: 30.8, y: 50 }
      case Influence.Terra:
        return { x: 49.6, y: 50 }
      case Influence.Mars:
        return { x: 68.1, y: 50 }
      case Influence.Jupiter:
        return { x: 86.5, y: 50 }
    }

    return { x: 0, y: 0 }
  }
}

export const planetBoardInfluenceDiscSpace = new PlanetBoardInfluenceDiscSpace()
