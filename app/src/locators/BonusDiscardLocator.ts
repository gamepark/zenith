import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { imWhiteTeam } from './position.utils'

export class BonusDiscardLocator extends ListLocator {
  gap = { y: 0.2 }
  getCoordinates(_location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) {
      return { x: 32, y: -9.5 }
    }

    return { x: -33, y: 7 }
  }
}

export const bonusDiscardLocator = new BonusDiscardLocator()
