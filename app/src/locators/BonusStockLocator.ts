import { PileLocator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location } from '@gamepark/rules-api'
import { imWhiteTeam } from './position.utils'

export class BonusStockLocator extends PileLocator {
  radius = 2
  getCoordinates(_location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) {
      return { x: 36.5, y: -7 }
    }

    return { x: -33, y: 7 }
  }
}

export const bonusStockLocator = new BonusStockLocator()
