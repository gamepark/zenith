import { Influence } from '../material/Influence'

export enum Memory {
  Mulligan = 1,
  TurnOrder,
  DiscardFaction,
  Effects,
  LastPlanetsMoved,
  CantPass,
  AlreadyPlayedPlayers,
  Pattern
}

export type PatternType = {
  influence: Influence
  count: number
}
