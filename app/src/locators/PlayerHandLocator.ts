import { HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location, MaterialItem } from '@gamepark/rules-api'
import { Agent } from '@gamepark/zenith/material/Agent'
import { Agents } from '@gamepark/zenith/material/Agents'
import { influences } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
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
    const leftSide = isLeftSidePlayer(context.rules.game, location.player!)
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

  getItemIndex(item: MaterialItem, context: ItemContext): number {
    if (item.id === undefined) return item.location.x ?? 0
    const handItems = context.rules.material(MaterialType.AgentCard)
      .location(LocationType.PlayerHand).player(item.location.player!)
      .getItems<Agent>()
    const reversed = new PlayerHelper(context.rules.game, item.location.player!).team !== getMyTeamColor(context)
    const sorted = [...handItems]
      .filter(i => i.id !== undefined)
      .sort((a, b) => {
        const pa = influences.indexOf(Agents[a.id!].influence)
        const pb = influences.indexOf(Agents[b.id!].influence)
        const oa = reversed ? -pa : pa
        const ob = reversed ? -pb : pb
        if (oa !== ob) return oa - ob
        return Agents[a.id!].cost - Agents[b.id!].cost
      })
    const rank = sorted.findIndex(i => i.id === item.id)
    return rank >= 0 ? rank : item.location.x ?? 0
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(15em)', `translateY(-50%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }

  isMyTeam(player: PlayerId, context: MaterialContext) {
    return getMyTeamColor(context) === new PlayerHelper(context.rules.game, player).team
  }
}

export const playerHandLocator = new PlayerHandLocator()
