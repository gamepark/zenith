import { ConditionType, Effect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'

// TODO: Alternative boards
export const getTechnologyAction = (id: string): Effect[][] => {
  switch (id) {
    case 'S':
      return TechnologySActions
    case 'U':
      return TechnologyUActions
    case 'N':
    default:
      return TechnologyNActions
  }
}

const TechnologySActions: Effect[][] = [
  [
    {
      type: EffectType.WinCredit,
      quantity: 2
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      pattern: [1, 1]
    }
  ],
  [
    {
      type: EffectType.Transfer,
      quantity: 3
    }
  ],
  [
    {
      type: EffectType.Conditional,
      mandatory: true,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Mobilize
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      mandatory: true,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Mobilize
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      mandatory: true,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Mobilize
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 1
      }
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      quantity: 2
    }
  ]
]

const TechnologyUActions: Effect[][] = [
  [
    {
      type: EffectType.WinInfluence,
      quantity: 1
    }
  ],
  [
    {
      type: EffectType.Mobilize,
      quantity: 2
    }
  ],
  [
    {
      type: EffectType.StealCredit,
      quantity: 3
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      pattern: [1, 1, 1]
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      quantity: 2
    }
  ]
]

const TechnologyNActions: Effect[][] = [
  [
    {
      type: EffectType.Transfer,
      quantity: 1
    }
  ],
  [
    {
      type: EffectType.TakeLeaderBadge
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 2
    },
    {
      type: EffectType.WinInfluence,
      differentPlanet: true,
      quantity: 1
    }
  ],
  [
    {
      type: EffectType.WinCredit,
      quantity: 20
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 2
    }
  ]
]
