import { Locator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location, MaterialItem, XYCoordinates } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { diplomacyBoardDescription } from '../material/DiplomacyBoardDescription'
import { imWhiteTeam } from './position.utils'

export class TeamPlanetLocator extends Locator {
  parentItemType = MaterialType.DiplomacyBoard

  getParentItem(_location: Location, context: MaterialContext): MaterialItem | undefined {
    return diplomacyBoardDescription.getStaticItems(context)[0]
  }

  getPositionOnParent(location: Location, _context: MaterialContext): XYCoordinates {
    const coordinates = { x: 0, y: 50 }

    if (location.player === TeamColor.White) {
      if (location.x === 0) coordinates.x = 100
      if (location.x === 1) {
        coordinates.x = 93
        coordinates.y -= 23.5
      }
      if (location.x === 2) {
        coordinates.x = 80
        coordinates.y -= 40.5
      }
      if (location.x === 3) {
        coordinates.x = 65.5
        coordinates.y -= 50
      }
    } else {
      if (location.x === 0) coordinates.x = 0
      if (location.x === 1) {
        coordinates.x = 7
        coordinates.y -= 23.5
      }
      if (location.x === 2) {
        coordinates.x = 20
        coordinates.y -= 40.5
      }
      if (location.x === 3) {
        coordinates.x = 34.5
        coordinates.y -= 50
      }
    }
    if (location.x === 4) {
      coordinates.x = 50
      coordinates.y -= 52.5
    }

    return coordinates
  }

  getRotateZ(_location: Location, context: MaterialContext): number {
    if (imWhiteTeam(context)) return -90
    return 90
  }
}

export const teamPlanetLocator = new TeamPlanetLocator()
