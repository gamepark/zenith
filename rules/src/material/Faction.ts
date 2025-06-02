import { getEnumValues } from '@gamepark/rules-api'

export enum Faction {
  Animod = 1,
  Human,
  Robot
}

export const factions = getEnumValues(Faction)
