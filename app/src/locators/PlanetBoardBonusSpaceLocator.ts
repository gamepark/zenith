import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { imWhiteTeam } from './position.utils'

export class PlanetBoardBonusSpaceLocator extends Locator {
  parentItemType = MaterialType.PlanetBoard

  getPositionOnParent(location: Location<PlayerId, LocationType, Influence>, _context: MaterialContext): XYCoordinates {
    const y = 50
    switch (location.id) {
      case Influence.Mercury:
        return { x: 19.4, y }
      case Influence.Venus:
        return { x: 37.9, y }
      case Influence.Terra:
        return { x: 56.4, y }
      case Influence.Mars:
        return { x: 75, y }
      case Influence.Jupiter:
        return { x: 93.9, y }
    }

    return { x: 0, y }
  }

  getRotateZ(_location: Location, context: MaterialContext): number {
    if (imWhiteTeam(context)) return 90
    return 270
  }
}

export const planetBoardBonusSpaceLocator = new PlanetBoardBonusSpaceLocator()
