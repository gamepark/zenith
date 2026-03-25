import { isItemContext, ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { Influence, influences } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor, teamColors } from '@gamepark/zenith/TeamColor'
import { planetBoardDescription } from '../material/PlanetBoardDescription'
import { InfluenceColumnDescription } from './InfluenceColumnDescription'
import { getMyTeamColor } from './position.utils'

export class InfluenceLocator extends ListLocator {
  parentItemType = MaterialType.PlanetBoard
  locationDescription = new InfluenceColumnDescription()
  maxCount = 5

  getLocations(_context: MaterialContext) {
    return teamColors.flatMap((team) =>
      influences.map((planet: Influence) => ({
        type: LocationType.Influence,
        player: team,
        id: planet
      }))
    )
  }
  getGap(location: Location, context: MaterialContext): Partial<Coordinates> {
    if (!isItemContext(context)) return {}
    if (location.player === TeamColor.White) return { y: 1.8 }
    return { y: -1.8 }
  }

  getMaxGap(location: Location, context: MaterialContext): Partial<Coordinates> {
    if (!isItemContext(context)) return {}
    const value = this.isMyTeam(location, context) ? 7.1 : 4.2
    return { y: location.player === TeamColor.White ? value : -value }
  }

  getParentItem() {
    return planetBoardDescription.staticItem
  }

  getPositionOnParent(location: Location, context: MaterialContext): Coordinates {
    const x = 12.6 + (location.id - 1) * 18.55
    const myTeam = this.isMyTeam(location, context)

    if (isItemContext(context)) {
      const y = location.player === TeamColor.White ? 123 : -23
      return { x, y, z: 0.05 }
    }

    const boardRotated = !this.isWhiteViewer(context)
    let y: number
    if (boardRotated) {
      y = myTeam ? -41 : 134
    } else {
      y = myTeam ? 141 : -34
    }

    return { x, y, z: 0.05 }
  }

  private isWhiteViewer(context: MaterialContext) {
    return getMyTeamColor(context) === TeamColor.White
  }

  getRotateZ(location: Location, context: MaterialContext): number {
    if (this.isMyTeam(location, context) && location.player === TeamColor.White) return 0
    if (!this.isMyTeam(location, context) && location.player !== TeamColor.White) return 0
    return 180
  }

  getItemRotateZ(item: MaterialItem, _context: ItemContext): number {
    if (item.location.player === TeamColor.White) return 0
    return 180
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    if (this.isMyTeam(item.location, context)) {
      return [`translateY(${item.location.x! > 2 ? -22 * Math.min(item.location.x! - 2, 2) : 0}%)`, 'translateZ(10em)', 'scale(2)']
    }

    if (item.location.x! > 3) {
      return [`translateY(-50%)`, 'translateZ(10em)', `rotateZ(-180deg)`, 'scale(2)']
    }

    return [`translateY(${item.location.x! > 2 ? -25 : 0}%)`, 'translateZ(10em)', `rotateZ(-180deg)`, 'scale(2)']
  }

  isMyTeam(location: Location, context: MaterialContext) {
    return getMyTeamColor(context) === location.player
  }
}

export const influenceLocator = new InfluenceLocator()
