import { Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { imWhiteTeam } from './position.utils'

export class TechnologyBoardPlaceLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    if (imWhiteTeam(context)) {
      return {
        x: -27.9,
        y: this.getYCoordinates(location),
        z: 0.05
      }
    }

    return {
      x: 27.9,
      y: this.getReverseYCoordinates(location),
      z: 0.05
    }
  }

  getReverseYCoordinates(location: Location) {
    const base = -16.75
    switch (location.id) {
      case 1:
        return base + 23.37
      case 2:
        return base + 16.75
      case 3:
      default:
        return base + 10.13
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

  getRotateZ(_location: Location, context: MaterialContext): number {
    if (imWhiteTeam(context)) return -90
    return 90
  }
}

export const technologyBoardPlaceLocator = new TechnologyBoardPlaceLocator()
