import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'

export class PlanetBoardInfluenceDiscSpaceLocator extends Locator {
  parentItemType = MaterialType.PlanetBoard

  getPositionOnParent(location: Location<PlayerId, LocationType, Influence>, _context: MaterialContext): XYCoordinates {
    let y = 50
    const locationX = location.x!
    const factor = locationX < 0 ? -1 : 1
    if (Math.abs(locationX) > 0) {
      y += factor * 4.6
    }
    y += 10.6 * location.x!
    switch (location.id) {
      case Influence.Mercury:
        return { x: 12.5, y }
      case Influence.Venus:
        return { x: 30.8, y }
      case Influence.Terra:
        return { x: 49.6, y }
      case Influence.Mars:
        return { x: 68.1, y }
      case Influence.Jupiter:
        return { x: 86.5, y }
    }

    return { x: 0, y }
  }
}

export const planetBoardInfluenceDiscSpaceLocator = new PlanetBoardInfluenceDiscSpaceLocator()
