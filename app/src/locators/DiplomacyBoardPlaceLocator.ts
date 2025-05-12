import { Locator } from '@gamepark/react-game'

export class DiplomacyBoardPlaceLocator extends Locator {
  coordinates = { x: 23.8, z: 0.05 }
  rotateZ = 90
}

export const diplomacyBoardPlaceLocator = new DiplomacyBoardPlaceLocator()
