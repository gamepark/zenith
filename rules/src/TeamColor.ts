import { getEnumValues } from '@gamepark/rules-api'

export enum TeamColor {
  Black = 1,
  White = 2
}

export const teamColors = getEnumValues(TeamColor)
