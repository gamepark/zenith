import { PileLocator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location } from '@gamepark/rules-api'
import { imWhiteTeam } from './position.utils'

export class ZenithiumStockLocator extends PileLocator {
  radius = 2.5
  getCoordinates(_location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) {
      return { x: 45, y: 7 }
    }

    return { x: -37.5, y: 7 }
  }
}

export const zenithiumStockLocator = new ZenithiumStockLocator()
