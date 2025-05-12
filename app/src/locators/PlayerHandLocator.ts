import { getRelativePlayerIndex, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'

export class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const index = getRelativePlayerIndex(context, location.player)
    console.log(index)
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
    const index = getRelativePlayerIndex(context, location.player)
    switch (index) {
      case 0:
      case 3:
        return 0
      case 1:
      case 2:
        return 180
    }

    return 0
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', `translateY(-45%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }
}

export const playerHandLocator = new PlayerHandLocator()
