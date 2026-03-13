import { MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getPlayerSide, getTeamColor, isWhite, PlayerSide } from '@gamepark/zenith/TeamColor'

export const imWhiteTeam = (context: MaterialContext) => {
  return isWhite(getMyTeamColor(context))
}

export const getMyTeamColor = (context: MaterialContext) => {
  const player: PlayerId = context.player ?? context.rules.players[0]
  return getTeamColor(player)
}

export const isWhitePlayer = (location: Location) => {
  return isWhite(getTeamColor(location.player!))
}

export const isLeftSidePlayer = (player: PlayerId) => {
  return getPlayerSide(player) === PlayerSide.Technology
}
