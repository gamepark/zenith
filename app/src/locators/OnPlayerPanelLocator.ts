import { Locator } from '@gamepark/react-game'
import { MaterialContext } from '@gamepark/react-game/dist/locators'
import { Location } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { getMyTeamColor } from './position.utils'

export class OnPlayerPanelLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const team = location.player as TeamColor
    const activePlayer = this.getActivePlayerForTeam(team, context)
    if (activePlayer !== undefined) {
      return this.getPanelCoordinates(activePlayer, context)
    }
    if (getMyTeamColor(context) === team) return { x: -50, y: 20, z: 10 }
    return { x: -50, y: -20, z: 10 }
  }

  private getActivePlayerForTeam(team: TeamColor, context: MaterialContext): PlayerId | undefined {
    const rule = (context.rules as any).game?.rule
    if (!rule?.player) return undefined
    const activePlayer = rule.player as PlayerId
    if (getTeamColor(activePlayer) === team) return activePlayer
    return undefined
  }

  private getPanelCoordinates(player: PlayerId, context: MaterialContext) {
    const is2Players = context.rules.players.length === 2
    const itsMe = (context.player ?? context.rules.players[0]) === player
    const itsMyTeam = getMyTeamColor(context) === getTeamColor(player)

    if (is2Players) {
      return itsMe ? { x: -50, y: 20, z: 10 } : { x: -50, y: -20, z: 10 }
    }

    if (itsMyTeam) {
      return itsMe ? { x: -50, y: 20, z: 10 } : { x: 44, y: 20, z: 10 }
    } else {
      const opponents = context.rules.players.filter((p: PlayerId) => getMyTeamColor(context) !== getTeamColor(p))
      return opponents[0] === player ? { x: -50, y: -20, z: 10 } : { x: 44, y: -20, z: 10 }
    }
  }
}

export const onPlayerPanelLocator = new OnPlayerPanelLocator()
