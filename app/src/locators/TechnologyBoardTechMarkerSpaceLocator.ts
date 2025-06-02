import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor } from '@gamepark/zenith/TeamColor'

export class TechnologyBoardTechMarkerSpaceLocator extends Locator {
  parentItemType = MaterialType.TechnologyBoard

  getPositionOnParent(location: Location, context: MaterialContext): XYCoordinates {
    const item = this.getParentItem(location, context)!
    let coordinates = { x: 0, y: 0 }

    if (TeamColor.Black === location.player) {
      if (item.location.id === Faction.Animod) coordinates = { x: 83, y: 94.5 }
      if (item.location.id === Faction.Human) coordinates = { x: 79.5, y: 94.5 }
      if (item.location.id === Faction.Robot) coordinates = { x: 66, y: 94.5 }
    } else {
      if (item.location.id === Faction.Animod) coordinates = { x: 34, y: 94.5 }
      if (item.location.id === Faction.Human) coordinates = { x: 20.5, y: 94.5 }
      if (item.location.id === Faction.Robot) coordinates = { x: 17, y: 94.5 }
    }

    coordinates.y -= this.computeYCoordinates(location)

    return coordinates
  }

  computeYCoordinates(location: Location) {
    console.log(location.x)
    if (location.x === 1) return 14
    if (location.x === 2) return 36
    if (location.x === 3) return 52.6
    if (location.x === 4) return 69.1
    if (location.x === 5) return 85.6
    return 0
  }
}

export const technologyBoardTechMarkerSpaceLocator = new TechnologyBoardTechMarkerSpaceLocator()
