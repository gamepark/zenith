import { Locator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location } from '@gamepark/rules-api'
import { getMyTeamColor } from './position.utils'

export class TeamLeaderBadgeLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    if (this.isMyTeam(location, context)) return { x: -46, y: 22, z: 0 }
    return { x: -46, y: -22, z: 0 }
  }

  isMyTeam(location: Location, context: MaterialContext) {
    return getMyTeamColor(context) === location.player
  }
}

export const teamLeaderBadgeLocator = new TeamLeaderBadgeLocator()
