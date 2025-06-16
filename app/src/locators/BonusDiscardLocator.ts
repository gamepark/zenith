import { DropAreaDescription, isItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { bonusTokenDescription } from '../material/BonusTokenDescription'
import { imWhiteTeam } from './position.utils'

export class BonusDiscardLocator extends ListLocator {
  gap = { y: 0.2, z: 0.5 }
  maxCount = 8
  getCoordinates(_location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) {
      return { x: 32, y: -9.5 }
    }

    return { x: -31.5, y: -9.5 }
  }

  getLocationIndex(location: Location, context: MaterialContext) {
    if (isItemContext(context)) return super.getLocationIndex(location, context)
    return 8
  }

  locationDescription = new DropAreaDescription({
    width: bonusTokenDescription.width + 0.5,
    height: bonusTokenDescription.height + 3.7,
    borderRadius: 1
  })
}

export const bonusDiscardLocator = new BonusDiscardLocator()
