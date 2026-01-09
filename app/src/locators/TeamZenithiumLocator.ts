/** @jsxImportSource @emotion/react */
import { PileLocator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location } from '@gamepark/rules-api'
import { getMyTeamColor } from './position.utils'

export class TeamZenithiumLocator extends PileLocator {
  radius = 1.5
  getCoordinates(location: Location, context: MaterialContext) {
    if (this.isMyTeam(location, context)) return { x: -50, y: 19.5, z: 0 }
    return { x: -50, y: -19.5, z: 0 }
  }

  isMyTeam(location: Location, context: MaterialContext) {
    return getMyTeamColor(context) === location.player
  }
}

export const teamZenithiumLocator = new TeamZenithiumLocator()
