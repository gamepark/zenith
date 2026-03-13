import { PileLocator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { getMyTeamColor } from './position.utils'

export class TeamZenithiumLocator extends PileLocator {
  radius = 1

  getCoordinates(location: Location, context: MaterialContext) {
    const activePlayer = this.getActivePlayerForTeam(location.player as TeamColor, context)
    if (activePlayer !== undefined) {
      return this.getPlayerPanelCoordinates(activePlayer, context)
    }
    if (this.isMyTeam(location, context)) return { x: -45.5, y: 18, z: 0 }
    return { x: -45.5, y: -19, z: 0 }
  }

  isMyTeam(location: Location, context: MaterialContext) {
    return getMyTeamColor(context) === location.player
  }

  getPileId(item: MaterialItem) {
    return `${item.id}`
  }

  private getActivePlayerForTeam(team: TeamColor, context: MaterialContext): PlayerId | undefined {
    const rule = context.rules.game?.rule
    if (!rule?.player) return undefined
    const activePlayer = rule.player as PlayerId
    if (getTeamColor(activePlayer) === team) return activePlayer
    return undefined
  }

  private getPlayerPanelCoordinates(player: PlayerId, context: MaterialContext) {
    const is2Players = context.rules.players.length === 2
    const itsMe = (context.player ?? context.rules.players[0]) === player
    const itsMyTeam = getMyTeamColor(context) === getTeamColor(player)

    if (is2Players) {
      return itsMe ? { x: -45.5, y: 18, z: 0 } : { x: -45.5, y: -19, z: 0 }
    }

    if (itsMyTeam) {
      return itsMe ? { x: -45.5, y: 18, z: 0 } : { x: 47, y: 18, z: 0 }
    } else {
      const opponents = context.rules.players.filter((p: PlayerId) => getMyTeamColor(context) !== getTeamColor(p))
      return opponents[0] === player ? { x: -45.5, y: -19, z: 0 } : { x: 47, y: -19, z: 0 }
    }
  }
}

export const teamZenithiumLocator = new TeamZenithiumLocator()
