import { Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class TechnologyBoardPlaceLocator extends Locator {
  getCoordinates(location: Location, _context: MaterialContext): Partial<Coordinates> {
    return {
      x: -27.9,
      y: this.getYCoordinates(location),
      z: 0.05
    }
  }

  getYCoordinates(location: Location) {
    const base = -16.75
    switch (location.id) {
      case 1:
        return base + 10.13
      case 2:
        return base + 16.75
      case 3:
      default:
        return base + 23.37
    }
  }

  rotateZ = -90
}

export const technologyBoardPlaceLocator = new TechnologyBoardPlaceLocator()
