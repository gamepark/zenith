import { Effect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { Faction } from '../../material/Faction'

// TODO: 4-player
export const getDiplomacyActions = (_players: number) => {
  return TwoPlayerDiplomacyActions
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
