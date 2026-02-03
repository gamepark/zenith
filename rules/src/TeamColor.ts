import { getEnumValues } from '@gamepark/rules-api'
import { Influence } from './material/Influence'
import { PlayerId } from './PlayerId'

export enum TeamColor {
  Black = 1,
  White = 2
}

export enum PlayerSide {
  Technology = 1,
  Diplomacy = 2
}

export const teamColors = getEnumValues(TeamColor)

export const isWhite = (playerId: TeamColor) => playerId === TeamColor.White
export const isBlack = (playerId: TeamColor) => playerId === TeamColor.Black
export const getTeamColor = (playerId: PlayerId) => (playerId === 1 || playerId === 4 ? TeamColor.White : TeamColor.Black)

// In 4-player mode, players have restricted planets for recruiting
// Players 1 & 2 sit on Technology side: Mercury, Venus, Terra
// Players 3 & 4 sit on Diplomacy side: Terra, Mars, Jupiter
export const getPlayerSide = (playerId: PlayerId): PlayerSide =>
  playerId <= 2 ? PlayerSide.Technology : PlayerSide.Diplomacy

export const TechnologySidePlanets = [Influence.Mercury, Influence.Venus, Influence.Terra]
export const DiplomacySidePlanets = [Influence.Terra, Influence.Mars, Influence.Jupiter]

export const getAllowedPlanets = (playerId: PlayerId): Influence[] =>
  getPlayerSide(playerId) === PlayerSide.Technology ? TechnologySidePlanets : DiplomacySidePlanets
