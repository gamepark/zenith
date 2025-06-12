import { ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { influenceDiscDescription } from '../material/InfluenceDiscDescription'
import { imWhiteTeam } from './position.utils'

export class InfluenceDiscStockLocator extends ListLocator {
  gap = { x: influenceDiscDescription.width + 0.2 }

  getCoordinates(location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) {
      return { x: 42, y: -9 + (location.id - 1 - 0.5) * influenceDiscDescription.width + 1, z: 0 }
    }

    return { x: -40, y: -9 + (location.id - 1 - 0.5) * influenceDiscDescription.width + 1, z: 0 }
  }
}

export const influenceDiscStockLocator = new InfluenceDiscStockLocator()
