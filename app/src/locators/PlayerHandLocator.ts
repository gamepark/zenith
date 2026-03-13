import { HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { getMyTeamColor } from './position.utils'

export class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext): Partial<Coordinates> {
    const is2Players = context.rules.players.length === 2
    const itsMyTeam = this.isMyTeam(location.player!, context)
    if (itsMyTeam) {
      const itsMe = (context.player ?? context.rules.players[0]) === location.player
      if (is2Players) return { x: itsMe ? -30 : -30, y: 16.5, z: 0.05 }
      return { x: itsMe ? -30 : 30, y: 16.5, z: 0.05 }
    } else {
      if (is2Players) return { x: -30, y: -16.5, z: 0.05 }
      const opponents = context.rules.players.filter((p) => !this.isMyTeam(p, context))
      const left = opponents[0] !== location.player
      return { x: left ? -30 : 30, y: -16.5, z: 0.05 }
    }
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
