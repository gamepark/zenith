import { TokenDescription } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import Zenithium from '../images/zenithium/Zenithium.png'
import { ZenithiumTokenHelp } from './ZenithiumTokenHelp'

class ZenithiumTokenDescription extends TokenDescription {
  help = ZenithiumTokenHelp
  image = Zenithium
  width = 2.2
  height = 1.93

  transparency = true

  stockLocation = { type: LocationType.ZenithiumStock }
  staticItem = { quantity: 15, location: this.stockLocation }
}

export const zenithiumTokenDescription = new ZenithiumTokenDescription()
