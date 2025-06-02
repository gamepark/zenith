import { TokenDescription } from '@gamepark/react-game'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import Black from '../images/technology-token/black.png'
import White from '../images/technology-token/white.png'

export class TechMarkerDescription extends TokenDescription {
  height = 1.3
  width = 1.45
  borderRadius = 1
  images = {
    [TeamColor.Black]: Black,
    [TeamColor.White]: White
  }
}

export const techMarkerDescription = new TechMarkerDescription()
