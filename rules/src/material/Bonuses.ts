import { Bonus } from './Bonus'
import { Effect } from './effect/Effect'
import { EffectType } from './effect/EffectType'

export type BonusDescription = {
  effect: Effect
}

export const Exile2OpponentCards: BonusDescription = {
  effect: {
    type: EffectType.Exile,
    quantity: 2,
    opponent: true
  }
}

export const Mobilize2: BonusDescription = {
  effect: {
    type: EffectType.Mobilize,
    quantity: 2
  }
}

export const TakeLeaderBadge: BonusDescription = {
  effect: {
    type: EffectType.TakeLeaderBadge
  }
}

export const Transfer: BonusDescription = {
  effect: {
    type: EffectType.Transfer
  }
}

export const Win1Zenithium: BonusDescription = {
  effect: {
    type: EffectType.WinZenithium,
    quantity: 1
  }
}

export const Win3Credit: BonusDescription = {
  effect: {
    type: EffectType.WinCredit,
    quantity: 3
  }
}
export const Win4Credits: BonusDescription = {
  effect: {
    type: EffectType.WinCredit,
    quantity: 4
  }
}
export const WinInfluence: BonusDescription = {
  effect: {
    type: EffectType.WinInfluence,
    quantity: 13
  }
}

export const Bonuses: Record<Bonus, BonusDescription> = {
  [Bonus.Exile2OpponentCards]: Exile2OpponentCards,
  [Bonus.Mobilize2]: Mobilize2,
  [Bonus.TakeLeaderBadge]: TakeLeaderBadge,
  [Bonus.Transfer]: Transfer,
  [Bonus.Win1Zenithium]: Win1Zenithium,
  [Bonus.Win3Credits]: Win3Credit,
  [Bonus.Win4Credits]: Win4Credits,
  [Bonus.WinInfluence]: WinInfluence
}
