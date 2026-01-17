import { TokenDescription } from '@gamepark/react-game'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import Black from '../images/technology-token/black.png'
import White from '../images/technology-token/white.png'
import { TechMarkerHelp } from './TechMarkerHelp'

export class TechMarkerDescription extends TokenDescription {
  help = TechMarkerHelp
  height = 1.3
  width = 1.45
  borderRadius = 1
  images = {
    [TeamColor.Black]: Black,
    [TeamColor.White]: White
  }

  transparency = true
}

export const techMarkerDescription = new TechMarkerDescription()
