import { BoardDescription, ComponentSize } from '@gamepark/react-game'
import TechnologyD from '../images/technology-boards/TechnologyD.jpg'
import TechnologyN from '../images/technology-boards/TechnologyN.jpg'
import TechnologyO from '../images/technology-boards/TechnologyO.jpg'
import TechnologyP from '../images/technology-boards/TechnologyP.jpg'
import TechnologyS from '../images/technology-boards/TechnologyS.jpg'
import TechnologyU from '../images/technology-boards/TechnologyU.jpg'

export class TechnologyBoardDescription extends BoardDescription {
  images = {
    D: TechnologyD,
    N: TechnologyN,
    O: TechnologyO,
    P: TechnologyP,
    S: TechnologyS,
    U: TechnologyU
  }

  getSize(_id: string, newParam: ComponentSize = { height: 18.9, width: 7.25 }): ComponentSize {
    switch (_id) {
      case 'O':
      case 'U':
        return {
          height: 18.9,
          width: 6
        }
      default:
        return newParam
    }
  }
}

export const technologyBoardDescription = new TechnologyBoardDescription()
