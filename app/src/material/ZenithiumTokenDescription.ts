import { TokenDescription } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import Zenithium from '../images/zenithium/Zenithium.png'

class ZenithiumTokenDescription extends TokenDescription {
  image = Zenithium
  width = 2.2
  height = 1.93

  stockLocation = { type: LocationType.ZenithiumStock }
  staticItem = { quantity: 15, location: this.stockLocation }
}

export const zenithiumTokenDescription = new ZenithiumTokenDescription()
