import { getEnumValues } from '@gamepark/rules-api'

export enum Bonus {
  Exile2OpponentCards = 1,
  Mobilize2,
  TakeLeaderBadge,
  Transfer,
  Win1Zenithium,
  Win3Credits,
  Win4Credits,
  WinInfluence
}

export const allBonuses = [
  Bonus.WinInfluence,
  Bonus.WinInfluence,
  Bonus.WinInfluence,
  Bonus.WinInfluence,
  Bonus.Win3Credits,
  Bonus.Win3Credits,
  Bonus.Win4Credits,
  Bonus.Win4Credits,
  Bonus.Win1Zenithium,
  Bonus.Win1Zenithium,
  Bonus.Win1Zenithium,
  Bonus.Exile2OpponentCards,
  Bonus.Mobilize2,
  Bonus.Transfer,
  Bonus.TakeLeaderBadge,
  Bonus.TakeLeaderBadge
]

export const bonuses = getEnumValues(Bonus)
