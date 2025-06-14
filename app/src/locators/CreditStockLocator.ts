import { PileLocator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location } from '@gamepark/rules-api'
import { Credit } from '@gamepark/zenith/material/Credit'
import { imWhiteTeam } from './position.utils'

export class CreditStockLocator extends PileLocator {
  radius = 2

  getCoordinates(location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) {
      return { x: 34 + this.getLocationDelta(location) * 5, y: 7 }
    }

    return { x: 44, y: -7 + this.getLocationDelta(location) * 6 }
  }

  getLocationDelta(location: Location) {
    switch (location.id) {
      case Credit.Credit1:
        return 0
      case Credit.Credit3:
        return 1.15
      case Credit.Credit5:
      default:
        return 2.35
    }
  }
}

export const creditStockLocator = new CreditStockLocator()
