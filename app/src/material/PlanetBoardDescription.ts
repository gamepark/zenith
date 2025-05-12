import { BoardDescription } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import PlanetBoard from '../images/planet-board/MainBoard.jpg'

export class PlanetBoardDescription extends BoardDescription {
  height = 20.5
  width = 37

  image = PlanetBoard

  staticItem = {
    location: {
      type: LocationType.PlanetBoardPlace
    }
  }
}

export const planetBoardDescription = new PlanetBoardDescription()
