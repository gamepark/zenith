import { DropAreaDescription, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { isWhite } from '@gamepark/zenith/TeamColor'
import { planetBoardDescription } from '../material/PlanetBoardDescription'
import { getMyTeamColor } from './position.utils'

export class InfluenceLocator extends ListLocator {
  parentItemType = MaterialType.PlanetBoard
  locationDescription = new DropAreaDescription({ width: 5.8, height: 11.5, borderRadius: 0.5 })
  maxCount = 3
  getGap(location: Location, _context: MaterialContext): Partial<Coordinates> {
    if (isWhite(location.player!)) return { y: 1.8 }
    return { y: -1.8 }
  }

  getMaxGap(location: Location<number, number>, context: MaterialContext<number, number, number>): Partial<Coordinates> {
    if (isWhite(location.player!)) return { y: 2.5 }
    return { y: -2.5 }
  }

  getParentItem() {
    return planetBoardDescription.staticItem
  }

  getPositionOnParent(location: Location, _context: MaterialContext): Coordinates {
    const baseCoordinates = { x: 0, y: 0, z: 0.05 }
    if (isWhite(location.player!)) {
      baseCoordinates.x += 12.6 + (location.id - 1) * 18.55
      baseCoordinates.y += 122
    } else {
      baseCoordinates.x += 12.6 + (location.id - 1) * 18.55
      baseCoordinates.y -= 22.3
    }

    return baseCoordinates
  }

  getRotateZ(location: Location, _context: MaterialContext): number {
    if (isWhite(location.player!)) return 0
    return 180
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    if (this.isMyTeam(item.location, context)) {
      return [`translateY(${item.location.x! > 2 ? -20 * Math.min(item.location.x! - 2, 2) - 20 : -20}%)`, 'translateZ(10em)', 'scale(2)']
    }

    if (item.location.x! > 3) {
      return [`translateY(-100%)`, 'translateZ(10em)', `rotateZ(-180deg)`, 'scale(2)']
    }

    return [`translateY(${item.location.x! > 2 ? -80 : -40}%)`, 'translateZ(10em)', `rotateZ(-180deg)`, 'scale(2)']
  }

  isMyTeam(location: Location, context: MaterialContext) {
    return getMyTeamColor(context) === location.player
  }
}

export const influenceLocator = new InfluenceLocator()
