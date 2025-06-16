import { getRelativePlayerIndex, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { getMyTeamColor } from './position.utils'

export class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
        return { x: -30, y: 20, z: 0.05 }
      case 1:
        return { x: -30, y: -20, z: 0.05 }
      case 2:
        return { x: 30, y: -20, z: 0.05 }
      default:
        return { x: 30, y: 20, z: 0.05 }
    }
  }

  getBaseAngle(location: Location, context: MaterialContext): number {
    if (this.isMyTeam(location, context)) return 0
    return 180
  }

  getMaxAngle(): number {
    return 11
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(15em)', `translateY(-45%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }

  isMyTeam(location: Location, context: MaterialContext) {
    return getMyTeamColor(context) === getTeamColor(location.player!)
  }
}

export const playerHandLocator = new PlayerHandLocator()
