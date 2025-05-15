import { TokenDescription } from '@gamepark/react-game'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import Black from '../images/technology-token/black.png'
import White from '../images/technology-token/white.png'

export class TechMarkerDescription extends TokenDescription {
  height = 1.4
  width = 1.56
  images = {
    [TeamColor.Black]: Black,
    [TeamColor.White]: White
  }
}

export const techMarkerDescription = new TechMarkerDescription()
