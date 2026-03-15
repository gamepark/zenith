import { ConditionType, Effect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { Faction } from '../../material/Faction'

export const getTechnologyAction = (id: string): Effect[][] => {
  switch (id) {
    case 'S':
      return TechnologySActions
    case 'U':
      return TechnologyUActions
    case 'D':
      return TechnologyDActions
    case 'O':
      return TechnologyOActions
    case 'P':
      return TechnologyPActions
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
    },
    {
      type: EffectType.TakeTechnologyBonusToken,
      faction: Faction.Animod,
      x: 2
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
    },
    {
      type: EffectType.TakeTechnologyBonusToken,
      faction: Faction.Human,
      x: 2
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
    },
    {
      type: EffectType.TakeTechnologyBonusToken,
      faction: Faction.Robot,
      x: 2
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

const TechnologyDActions: Effect[][] = [
  [
    {
      type: EffectType.Exile,
      opponent: true,
      quantity: 1
    }
  ],
  [
    {
      type: EffectType.WinCredit,
      quantity: 5
    },
    {
      type: EffectType.TakeTechnologyBonusToken,
      faction: Faction.Robot,
      x: 2
    }
  ],
  [
    {
      type: EffectType.TakeBonus
    },
    {
      type: EffectType.WinInfluence,
      quantity: 1
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      pattern: [1, 1, 1, 1, 1]
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      quantity: 2
    }
  ]
]

const TechnologyOActions: Effect[][] = [
  [
    {
      type: EffectType.TakeBonus
    }
  ],
  [
    {
      type: EffectType.StealZenithium,
      quantity: 1
    },
    {
      type: EffectType.TakeTechnologyBonusToken,
      faction: Faction.Human,
      x: 2
    }
  ],
  [
    {
      type: EffectType.Mobilize,
      quantity: 3
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      pattern: [2, 2]
    }
  ],
  [
    {
      type: EffectType.WinInfluence,
      quantity: 2
    }
  ]
]

const TechnologyPActions: Effect[][] = [
  [
    {
      type: EffectType.Mobilize,
      quantity: 1
    }
  ],
  [
    {
      type: EffectType.Mobilize,
      quantity: 1
    },
    {
      type: EffectType.Transfer,
      quantity: 1
    },
    {
      type: EffectType.Exile,
      opponent: true,
      quantity: 1
    }
  ],
  [
    {
      type: EffectType.WinCredit,
      quantity: 10
    }
  ],
  [
    {
      type: EffectType.Conditional,
      mandatory: true,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 2
      }
    },
    {
      type: EffectType.Conditional,
      mandatory: true,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          differentPlanet: true
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 2
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

export const TechnologyLineBonuses: Effect[] = [
  {
    type: EffectType.WinInfluence,
    quantity: 1
  },
  {
    type: EffectType.WinInfluence,
    quantity: 2
  },
  {
    type: EffectType.WinInfluence,
    quantity: 3
  }
]
