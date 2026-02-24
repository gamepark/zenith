import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialGame } from '@gamepark/rules-api'
import { DIPLOMACY_BOARD_HORIZONTAL_STEPS } from '../tutorial/ZenithTutorial'
import { imWhiteTeam } from './position.utils'

export class DiplomacyBoardPlaceLocator extends Locator {
  getCoordinates(_location: Location, context: MaterialContext) {
    if (imWhiteTeam(context)) return { x: 23.8, z: 0.05 }
    return {
      x: -23.8,
      z: 0.05
    }
  }

  getRotateZ(_location: Location, context: MaterialContext): number {
    const tutorial = (context.rules.game as MaterialGame).tutorial
    if (tutorial && DIPLOMACY_BOARD_HORIZONTAL_STEPS.includes(tutorial.step)) return 0
    if (imWhiteTeam(context)) return 90
    return -90
  }
}

export const diplomacyBoardPlaceLocator = new DiplomacyBoardPlaceLocator()
