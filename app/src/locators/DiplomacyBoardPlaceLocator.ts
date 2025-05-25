import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { imWhiteTeam } from './position.utils'

export class DiplomacyBoardPlaceLocator extends Locator {
  getCoordinates(_location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) return { x: 23.8, z: 0.05 }
    return {
      x: -23.8,
      z: 0.05
    }
  }

  getRotateZ(_location: Location, context: MaterialContext): number {
    if (imWhiteTeam(context)) return 90
    return -90
  }
}

export const diplomacyBoardPlaceLocator = new DiplomacyBoardPlaceLocator()
