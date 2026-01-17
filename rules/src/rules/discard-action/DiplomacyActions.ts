import { Effect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { Faction } from '../../material/Faction'

export const getDiplomacyActions = (players: number) => {
  return players === 4 ? FourPlayerDiplomacyActions : TwoPlayerDiplomacyActions
}

const TwoPlayerDiplomacyActions: Record<Faction, Effect[]> = {
  [Faction.Robot]: [
    {
      type: EffectType.TakeLeaderBadge
    },
    {
      type: EffectType.WinZenithium,
      quantity: 1
    }
  ],
  [Faction.Human]: [
    {
      type: EffectType.TakeLeaderBadge
    },
    {
      type: EffectType.WinCredit,
      quantity: 3
    }
  ],
  [Faction.Animod]: [
    {
      type: EffectType.TakeLeaderBadge
    },
    {
      type: EffectType.Mobilize,
      quantity: 2
    }
  ]
}

const FourPlayerDiplomacyActions: Record<Faction, Effect[]> = {
  [Faction.Robot]: [
    {
      type: EffectType.TakeLeaderBadge
    },
    {
      type: EffectType.WinZenithium,
      quantity: 1
    },
    {
      type: EffectType.ShareCard,
      maxQuantity: 2
    }
  ],
  [Faction.Human]: [
    {
      type: EffectType.TakeLeaderBadge
    },
    {
      type: EffectType.WinCredit,
      quantity: 3
    },
    {
      type: EffectType.ShareCard,
      maxQuantity: 2
    }
  ],
  [Faction.Animod]: [
    {
      type: EffectType.TakeLeaderBadge
    },
    {
      type: EffectType.Mobilize,
      quantity: 2
    },
    {
      type: EffectType.ShareCard,
      maxQuantity: 2
    }
  ]
}
