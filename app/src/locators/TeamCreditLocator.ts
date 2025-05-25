import { PileLocator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { getMyTeamColor } from './position.utils'

export class TeamCreditLocator extends PileLocator {
  radius = 2
  getCoordinates(location: Location, context: MaterialContext) {
    if (this.isMyTeam(location, context)) return { x: -46, y: 16, z: 0 }
    return { x: -46, y: -16, z: 0 }
  }

  isMyTeam(location: Location, context: MaterialContext) {
    return getMyTeamColor(context) === location.player
  }

  getPileId(item: MaterialItem) {
    return `${item.id}`
  }
}

export const teamCreditLocator = new TeamCreditLocator()
