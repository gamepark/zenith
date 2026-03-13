import { HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { getMyTeamColor, imWhiteTeam, isLeftSidePlayer } from './position.utils'

export class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const is2Players = context.rules.players.length === 2
    const itsMyTeam = this.isMyTeam(location.player!, context)
    if (is2Players) {
      const itsMe = (context.player ?? context.rules.players[0]) === location.player
      return { x: -30, y: itsMe ? 16.5 : -16.5, z: 0.05 }
    }
    const y = itsMyTeam ? 16.5 : -16.5
    const boardRotated = !imWhiteTeam(context)
    const leftSide = isLeftSidePlayer(location.player!)
    const x = (leftSide !== boardRotated) ? -30 : 30
    return { x, y, z: 0.05 }
  }

  getBaseAngle(location: Location, context: MaterialContext): number {
    if (this.isMyTeam(location.player!, context)) return 0
    return 180
  }

  getMaxAngle(location: Location, context: MaterialContext): number {
    if (!this.isMyTeam(location.player!, context)) return 7
    return 11
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(15em)', `translateY(-50%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }

  isMyTeam(player: PlayerId, context: MaterialContext) {
    return getMyTeamColor(context) === getTeamColor(player)
  }
}

export const playerHandLocator = new PlayerHandLocator()
