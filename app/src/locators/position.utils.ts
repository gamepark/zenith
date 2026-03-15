import { MaterialContext } from '@gamepark/react-game'
import { Location, MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { PlayerSide, TeamColor } from '@gamepark/zenith/TeamColor'

export const imWhiteTeam = (context: MaterialContext) => {
  return getMyTeamColor(context) === TeamColor.White
}

export const getMyTeamColor = (context: MaterialContext) => {
  const player: PlayerId = context.player ?? context.rules.players[0]
  return new PlayerHelper(context.rules.game as MaterialGame, player).team
}

export const isWhitePlayer = (location: Location, game: MaterialGame) => {
  return new PlayerHelper(game, location.player!).team === TeamColor.White
}

export const isLeftSidePlayer = (game: MaterialGame, player: PlayerId) => {
  return new PlayerHelper(game, player).side === PlayerSide.Technology
}
