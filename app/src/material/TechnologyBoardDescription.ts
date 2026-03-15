import { BoardDescription, ComponentSize, ItemContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { teamColors } from '@gamepark/zenith/TeamColor'
import { TechnologyBoardHelp } from './TechnologyBoardHelp'
import TechnologyD from '../images/technology-boards/TechnologyD.jpg'
import TechnologyN from '../images/technology-boards/TechnologyN.jpg'
import TechnologyO from '../images/technology-boards/TechnologyO.jpg'
import TechnologyP from '../images/technology-boards/TechnologyP.jpg'
import TechnologyS from '../images/technology-boards/TechnologyS.jpg'
import TechnologyU from '../images/technology-boards/TechnologyU.jpg'

export class TechnologyBoardDescription extends BoardDescription {
  help = TechnologyBoardHelp

  images = {
    D: TechnologyD,
    N: TechnologyN,
    O: TechnologyO,
    P: TechnologyP,
    S: TechnologyS,
    U: TechnologyU
  }

  getSize(_id: string, newParam: ComponentSize = { height: 20.5, width: 7.25 }): ComponentSize {
    switch (_id) {
      case 'O':
      case 'U':
        return {
          height: 20.5,
          width: 6
        }
      default:
        return newParam
    }
  }

  getLocations(_item: MaterialItem, context: ItemContext): Location[] {
    return teamColors.map((team) => ({
      type: LocationType.TechLevelBar,
      parent: context.index,
      player: team,
      id: _item.location.id
    }))
  }
}

export const technologyBoardDescription = new TechnologyBoardDescription()
