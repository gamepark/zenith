import { ComponentSize, DropAreaDescription, isItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor } from '@gamepark/zenith/TeamColor'

export class TechnologyBoardTechMarkerSpaceLocator extends Locator {
  parentItemType = MaterialType.TechnologyBoard

  getPositionOnParent(location: Location, context: MaterialContext): XYCoordinates {
    const isLocation = !isItemContext(context)
    const item = this.getParentItem(location, context)!
    let coordinates = { x: 0, y: 0 }

    if (TeamColor.Black === location.player) {
      if (item.location.id === Faction.Animod) coordinates = { x: isLocation ? 58 : 83, y: 87.5 }
      if (item.location.id === Faction.Human) coordinates = { x: isLocation ? 50 : 79.5, y: 87.5 }
      if (item.location.id === Faction.Robot) coordinates = { x: isLocation ? 42 : 66, y: 87.5 }
    } else {
      if (item.location.id === Faction.Animod) coordinates = { x: isLocation ? 58 : 34, y: 87.5 }
      if (item.location.id === Faction.Human) coordinates = { x: isLocation ? 50 : 20.5, y: 87.5 }
      if (item.location.id === Faction.Robot) coordinates = { x: isLocation ? 42 : 17, y: 87.5 }
    }

    if (isLocation) {
      if (location.x === 2) {
        coordinates.y += 5.5
      } else {
        coordinates.y += 2.1
      }
    }

    coordinates.y -= this.computeYCoordinates(location)

    return coordinates
  }

  computeYCoordinates(location: Location) {
    if (location.x === 1) return 13
    if (location.x === 2) return 33.5
    if (location.x === 3) return 48.6
    if (location.x === 4) return 64
    if (location.x === 5) return 79
    return 0
  }

  locationDescription = new TechnologyBoardTechMarkerSpaceLocationDescription()
}

class TechnologyBoardTechMarkerSpaceLocationDescription extends DropAreaDescription {
  borderRadius = 0.5
  getLocationSize(location: Location): ComponentSize {
    return { width: 5, height: location.x === 2 ? 4 : 2.6 }
  }
}

export const technologyBoardTechMarkerSpaceLocator = new TechnologyBoardTechMarkerSpaceLocator()
