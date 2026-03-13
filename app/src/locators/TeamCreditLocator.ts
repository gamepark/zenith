import { PileLocator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { getMyTeamColor } from './position.utils'

export class TeamCreditLocator extends PileLocator {
  radius = 1

  getCoordinates(location: Location, context: MaterialContext) {
    const itsMyTeam = getMyTeamColor(context) === (location.player as TeamColor)
    return { x: -50.5, y: itsMyTeam ? 18 : -19, z: 0 }
  }

  getPileId(item: MaterialItem) {
    return `${item.id}`
  }
}

export const teamCreditLocator = new TeamCreditLocator()
