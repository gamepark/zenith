import { Locator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { imWhiteTeam } from './position.utils'

export class TechnologyBoardPlaceLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    if (imWhiteTeam(context)) {
      return {
        x: -28.8 - this.getYCoordinates(location),
        y: 0,
        z: 0.05
      }
    }

    return {
      x: 28.8 + this.getReverseYCoordinates(location),
      y: 0,
      z: 0.05
    }
  }

  getReverseYCoordinates(location: Location) {
    const base = -16.75
    switch (location.id) {
      case Faction.Robot:
        return base + 23.37
      case Faction.Human:
        return base + 16.75
      case Faction.Animod:
      default:
        return base + 10.13
    }
  }

  getYCoordinates(location: Location) {
    const base = -16.75
    switch (location.id) {
      case Faction.Robot:
        return base + 10.13
      case Faction.Human:
        return base + 16.75
      case Faction.Animod:
      default:
        return base + 23.37
    }
  }
}

export const technologyBoardPlaceLocator = new TechnologyBoardPlaceLocator()
