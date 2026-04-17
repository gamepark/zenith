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
  ShareCardRemaining,
  DiscardChoice,
  LastPlanetMove,
  Team,
  SecretAgent,
  Refilling
}

export type PatternType = {
  influence: Influence
  count: number
}

export type LastPlanetMoveType = {
  influence: Influence
  previousX: number
}

export type EffectSourceType = {
  type: MaterialType
  value: unknown
}
