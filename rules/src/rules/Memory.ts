import { Influence } from '../material/Influence'
import { MaterialType } from '../material/MaterialType'

export enum Memory {
  Mulligan = 1,
  TurnOrder,
  DiscardFaction,
  Effects,
  LastPlanetsMoved,
  CantPass,
  AlreadyPlayedPlayers,
  Pattern,
  CardPlayed,
  Credit,
  Zenithium,
  CurrentEffect,
  WonBonus,
  CurrentTeam,
  TeamFirst,
  ShareCardRemaining
}

export type PatternType = {
  influence: Influence
  count: number
}

export type EffectSourceType = {
  type: MaterialType
  value: unknown
}
