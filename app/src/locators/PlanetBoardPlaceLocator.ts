import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { imWhiteTeam } from './position.utils'

export class PlanetBoardPlaceLocator extends Locator {
  coordinates = { x: 0, y: 0 }

  getRotateZ(_location: Location, context: MaterialContext): number {
    if (imWhiteTeam(context)) return 0
    return 180
  }
}

export const planetBoardPlaceLocator = new PlanetBoardPlaceLocator()
