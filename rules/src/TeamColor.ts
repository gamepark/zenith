import { getEnumValues } from '@gamepark/rules-api'
import { PlayerId } from './PlayerId'

export enum TeamColor {
  Black = 1,
  White = 2
}

export const teamColors = getEnumValues(TeamColor)

export const isWhite = (playerId: TeamColor) => playerId === TeamColor.White
export const isBlack = (playerId: TeamColor) => playerId === TeamColor.Black
export const getTeamColor = (playerId: PlayerId) => (playerId === 1 || playerId === 4 ? TeamColor.White : TeamColor.Black)
