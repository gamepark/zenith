import { Agent } from './Agent'
import { ConditionType, Effect } from './effect/Effect'
import { EffectType } from './effect/EffectType'
import { Faction } from './Faction'
import { Influence } from './Influence'

type AgentCharacteristics = {
  influence: Influence
  cost: number
  faction: Faction
  effects: Effect[]
}

export const Elisabeth: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 2,
  faction: Faction.Animod,
  effects: [
    { type: EffectType.WinInfluence, influence: Influence.Terra, quantity: 1 },
    { type: EffectType.Discard },
    {
      type: EffectType.WinZenithium,
      quantity: 1
    }
  ]
}

export const Pkd1ck: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 5,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    }
  ]
}

export const AgentEzra: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 1,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    { type: EffectType.WinCredit, quantity: 4 },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveZenithium
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 2,
        influence: Influence.Venus
      }
    }
  ]
}

export const DonaldSmooth: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 2,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    { type: EffectType.Conditional, condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Discard } }, effect: { type: EffectType.WinCredit } }
  ]
}

export const Huxl3y: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 5,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      quantity: 1
    },
    { type: EffectType.Conditional, condition: { type: ConditionType.Leader }, effect: { type: EffectType.WinCredit, quantity: 3 } }
  ]
}

export const Titus: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 1,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.GiveInfluence,
      except: Influence.Mars
    },
    { type: EffectType.WinCredit, quantity: 10 }
  ]
}

export const Mc4ffr3y: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 4,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      quantity: 2
    }
  ]
}

export const Luc4s: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 2,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Venus,
          factors: [2, 4, 7],
          quantities: [2, 4, 7]
        }
      },
      effect: {
        type: EffectType.WinZenithium
      }
    }
  ]
}

export const Cresus: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 1,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    { type: EffectType.WinCredit, quantity: 6 }
  ]
}

export const Atlas: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Discard } },
      effect: { type: EffectType.TakeLeaderBadge }
    }
  ]
}

export const PunkMari: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 7,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Discard,
      full: true
    },
    {
      type: EffectType.WinInfluence,
      quantity: 2
    }
  ]
}

export const Septimus: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mars,
          factors: [2, 4, 7],
          quantities: [2, 4, 7]
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mars
      }
    }
  ]
}

export const DoubleJoe: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 5,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      quantity: 2
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveLeaderBadge
        }
      },
      effect: {
        type: EffectType.WinZenithium,
        quantity: 2
      }
    }
  ]
}

export const DonDune: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 6,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.TakeLeaderBadge
    }
  ]
}

export const V3rn3: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 2,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Terra,
          factors: [2, 4, 7],
          quantities: [2, 4, 7]
        }
      },
      effect: {
        type: EffectType.WinZenithium
      }
    }
  ]
}

export const Ch4mb3rs: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 8,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      quantity: 3
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    }
  ]
}

export const Buj0ld: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 7,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.DevelopTechnology,
      free: true,
      lowest: true
    }
  ]
}

export const JackCurry: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 1,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 4
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveZenithium,
          quantity: 1
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mercury,
        quantity: 2
      }
    }
  ]
}

export const C1x1n: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 4,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Venus,
        quantity: 1
      }
    }
  ]
}

export const LadyMoore: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 10,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      mandatory: true,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          opponent: true
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
          type: EffectType.Exile,
          opponent: true
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
          type: EffectType.Exile,
          opponent: true
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 1
      }
    }
  ]
}

export const L0v3cr4ft: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 5,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mercury
        }
      },
      effect: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Venus
        }
      },
      effect: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mars
        }
      },
      effect: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Jupiter
        }
      },
      effect: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    }
  ]
}

export const Suleiman: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 1,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.SpendCredit,
          quantities: [3, 7, 12],
          factors: [1, 2, 3]
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        except: Influence.Jupiter
      }
    }
  ]
}

export const Annie: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 1,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 5
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveLeaderBadge
        }
      },
      effect: {
        type: EffectType.WinCredit,
        quantity: 7
      }
    }
  ]
}

export const M4th3s0n: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 4,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Terra,
        quantity: 1
      }
    }
  ]
}

export const Gilgamesh: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 9,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      quantity: 2
    },
    {
      type: EffectType.WinInfluence,
      quantity: 2,
      opponentSide: true
    }
  ]
}

export const StessyPower: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 3,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.SpendZenithium,
          quantities: [1, 2, 4],
          factors: [1, 2, 3]
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        except: Influence.Venus
      }
    }
  ]
}

export const Felis: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      quantity: 3
    },
    {
      type: EffectType.WinZenithium,
      opponent: true,
      quantity: 1
    }
  ]
}

export const V4nc3: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 2,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Choice,
      left: {
        type: EffectType.Transfer
      },
      right: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    }
  ]
}

export const Ramses: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Choice,
      left: {
        type: EffectType.Transfer,
        quantity: 2
      },
      right: {
        type: EffectType.WinCredit,
        quantity: 8
      }
    }
  ]
}

export const GuyGambler: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 3,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 5
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.TakeBonus
      }
    }
  ]
}

export const DocWissen: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 6,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.DevelopTechnology,
      discount: 1,
      faction: Faction.Human
    }
  ]
}

export const BaronGoro: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 4,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.GiveInfluence,
      except: Influence.Terra
    },
    {
      type: EffectType.WinZenithium,
      quantity: 3
    }
  ]
}

export const Ivan: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 1,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      factorPerDifferentOpponentInfluence: 2
    }
  ]
}

export const Br4dbury: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 6,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.DevelopTechnology,
      discount: 1,
      faction: Faction.Robot
    }
  ]
}

export const F4rm3r: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 6,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      differentPlanet: true,
      quantity: 1
    }
  ]
}

export const Zenon: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 1,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 8
    },
    {
      type: EffectType.WinCredit,
      opponent: true,
      quantity: 2
    }
  ]
}

export const Bish0p: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 4,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mars,
        quantity: 1
      }
    }
  ]
}

export const Wul: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 2,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mars,
          quantities: [2, 4, 7],
          factors: [2, 4, 7]
        }
      },
      effect: {
        type: EffectType.WinZenithium
      }
    }
  ]
}

export const Th0mps0n: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 8,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 2
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.HaveCredits,
        min: 6
      },
      effect: {
        type: EffectType.WinInfluence,
        differentPlanet: true,
        quantity: 1
      }
    }
  ]
}

export const Domitian: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 9,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
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
  ]
}

export const MasterDin: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 6,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.TakeLeaderBadge
    }
  ]
}

export const LordCreep: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 5,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      quantity: 1,
      opponentSide: true
    },
    {
      type: EffectType.TakeLeaderBadge
    }
  ]
}

export const Amytis: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mercury,
          quantities: [2, 4, 7],
          factors: [1, 2, 3]
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mercury
      }
    }
  ]
}

export const W4ts0n: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 1,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 5
    },
    {
      type: EffectType.Mobilize
    }
  ]
}

export const Arnulf: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Jupiter,
          quantities: [2, 4, 7],
          factors: [1, 2, 3]
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Jupiter
      }
    }
  ]
}

export const R0bins0n: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 2,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mars,
          quantities: [2, 4, 7],
          factors: [2, 4, 7]
        }
      },
      effect: {
        type: EffectType.WinZenithium
      }
    }
  ]
}

export const QueenSuzanne: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 10,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 2
    },
    {
      type: EffectType.WinZenithium,
      quantity: 2
    },
    {
      type: EffectType.TakeLeaderBadge,
      gold: true
    }
  ]
}

export const H4milt0n: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 2,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Mobilize,
      quantity: 2
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveLeaderBadge
        }
      },
      effect: {
        type: EffectType.Mobilize,
        quantity: 3
      }
    }
  ]
}

export const Caesar: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 2,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Choice,
      left: {
        type: EffectType.WinZenithium
      },
      right: {
        type: EffectType.WinCredit,
        quantity: 7
      }
    }
  ]
}

export const IldaFlores: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 1,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      perLevel1Technology: [1, 2, 3]
    }
  ]
}

export const H3rb3rt: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 6,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mercury
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mercury,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Venus
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Venus,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Mars
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mars,
        quantity: 1
      }
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Jupiter
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Jupiter,
        quantity: 1
      }
    }
  ]
}

export const LisaCharity: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 2,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      quantity: 2
    },
    {
      type: EffectType.WinCredit,
      opponent: true,
      quantity: 3
    }
  ]
}

export const SirSam: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 7,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.ResetInfluence
    }
  ]
}

export const HiroshiSun: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 1,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 4
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveZenithium,
          quantity: 1
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mars,
        quantity: 2
      }
    }
  ]
}

export const Magellan: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 10,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      differentPlanet: true,
      quantity: 1
    },
    {
      type: EffectType.Transfer,
      influence: Influence.Mercury
    },
    {
      type: EffectType.Transfer,
      influence: Influence.Venus
    },
    {
      type: EffectType.Transfer,
      influence: Influence.Terra
    },
    {
      type: EffectType.Transfer,
      influence: Influence.Mars
    },
    {
      type: EffectType.Transfer,
      influence: Influence.Jupiter
    }
  ]
}

export const Bajazet: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          opponent: true
        }
      },
      effect: {
        type: EffectType.WinCredit
      }
    }
  ]
}

export const Geta: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Choice,
      left: {
        type: EffectType.TakeLeaderBadge,
        gold: true
      },
      right: {
        type: EffectType.WinCredit,
        quantity: 8
      }
    }
  ]
}

export const Charlemagne: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 8,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      differentPlanet: true,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      differentPlanet: true,
      quantity: 1
    }
  ]
}

export const Caligula: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 5,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      mandatory: true,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Transfer
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 1
      }
    }
  ]
}

export const Tiberius: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Terra,
          quantities: [2, 4, 7],
          factors: [1, 2, 3]
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Terra
      }
    }
  ]
}

export const And3rs0n: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 6,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      fromCenter: true,
      quantity: 2
    }
  ]
}

export const Orw3ll: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 1,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.TakeBonus
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveLeaderBadge
        }
      },
      effect: {
        type: EffectType.WinCredit,
        quantity: 7
      }
    }
  ]
}

export const As1m0v: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 10,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.DevelopTechnology,
      discount: 2
    }
  ]
}

export const HelenaKerr: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 6,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      quantity: 2,
      except: Influence.Terra
    }
  ]
}

export const LittleBob: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 3,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      except: Influence.Mars,
      quantity: 1
    }
  ]
}

export const Bruss0l0: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 1,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium
    }
  ]
}

export const B4rj4v3l: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 2,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Jupiter,
          quantities: [2, 4, 7],
          factors: [2, 4, 7]
        }
      },
      effect: {
        type: EffectType.WinZenithium
      }
    }
  ]
}

export const Augustus: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 10,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      quantity: 2,
      pattern: [1, 2, 1]
    }
  ]
}

export const LulaSmart: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 1,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 4
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveZenithium,
          quantity: 1
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Terra,
        quantity: 2
      }
    }
  ]
}

export const CharlizeGun: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 4,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.Mobilize
    },
    {
      type: EffectType.Transfer
    },
    {
      type: EffectType.Exile,
      opponent: true
    }
  ]
}

export const ProfessorZed: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 9,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      quantity: 4
    }
  ]
}

export const IceJune: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 4,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Discard
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 1
      }
    }
  ]
}

export const V4nV0gt: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 6,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.Choice,
      left: {
        type: EffectType.Transfer
      },
      right: {
        type: EffectType.WinZenithium,
        quantity: 1
      }
    }
  ]
}

export const KingHarold: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 6,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.TakeLeaderBadge
    }
  ]
}

export const Geronimo: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 2,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      factorPerDifferentInfluence: 2
    }
  ]
}

export const W3lls: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 4,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Mercury,
        quantity: 1
      }
    }
  ]
}

export const Nero: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 7,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinZenithium,
      quantity: 2
    }
  ]
}

export const Cl4rke: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 9,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 2
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveZenithium,
          quantity: 1
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        differentPlanet: true,
        quantity: 2
      }
    }
  ]
}

export const Chaka: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 1,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          quantity: 2,
          except: Influence.Mercury
        }
      },
      effect: {
        type: EffectType.WinCredit,
        quantity: 10
      }
    }
  ]
}

export const M4rt1n: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 4,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.Leader
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Jupiter,
        quantity: 1
      }
    }
  ]
}

export const Pachacuti: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 3,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Exile,
          influence: Influence.Venus,
          quantities: [2, 4, 7],
          factors: [1, 2, 3]
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        influence: Influence.Venus
      }
    }
  ]
}

export const Gibs0n: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 4,
  faction: Faction.Robot,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Transfer,
      quantity: 2
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveLeaderBadge
        }
      },
      effect: {
        type: EffectType.Transfer,
        quantity: 2
      }
    }
  ]
}

export const HandyLuke: AgentCharacteristics = {
  influence: Influence.Mars,
  cost: 4,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mars,
      quantity: 1
    },
    {
      type: EffectType.TakeBonus,
      visible: true
    }
  ]
}

export const Khan: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 9,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      resetDifferentPlanet: true,
      quantity: 2
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveLeaderBadge
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 2,
        differentPlanet: true
      }
    }
  ]
}

export const Moussa: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 2,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },

    {
      type: EffectType.WinCredit,
      perLevel1Technology: [4, 8, 12]
    }
  ]
}

export const Archimedes: AgentCharacteristics = {
  influence: Influence.Venus,
  cost: 6,
  faction: Faction.Animod,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Venus,
      quantity: 1
    },
    {
      type: EffectType.DevelopTechnology,
      discount: 1,
      faction: Faction.Animod
    }
  ]
}

export const SneakyJules: AgentCharacteristics = {
  influence: Influence.Terra,
  cost: 1,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.WinCredit,
      quantity: 4
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveZenithium,
          quantity: 1
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 2,
        fromCenter: true
      }
    }
  ]
}

export const SecretKali: AgentCharacteristics = {
  influence: Influence.Mercury,
  cost: 2,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Mercury,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.GiveCredit,
          quantity: 3
        }
      },
      effect: {
        type: EffectType.WinInfluence,
        quantity: 2,
        except: Influence.Mercury
      }
    }
  ]
}

export const CaptainAndreev: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 4,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.Conditional,
      condition: {
        type: ConditionType.DoEffect,
        effect: {
          type: EffectType.Transfer
        }
      },
      effect: {
        type: EffectType.WinCredit
      }
    }
  ]
}

export const MiladyJones: AgentCharacteristics = {
  influence: Influence.Jupiter,
  cost: 6,
  faction: Faction.Human,
  effects: [
    {
      type: EffectType.WinInfluence,
      influence: Influence.Jupiter,
      quantity: 1
    },
    {
      type: EffectType.WinInfluence,
      influence: Influence.Terra,
      quantity: 1
    },
    {
      type: EffectType.TakeLeaderBadge
    }
  ]
}

export const Agents: Record<Agent, AgentCharacteristics> = {
  [Agent.Elisabeth]: Elisabeth,
  [Agent.Pkd1ck]: Pkd1ck,
  [Agent.AgentEzra]: AgentEzra,
  [Agent.DonaldSmooth]: DonaldSmooth,
  [Agent.Huxl3y]: Huxl3y,
  [Agent.Titus]: Titus,
  [Agent.Mc4ffr3y]: Mc4ffr3y,
  [Agent.Luc4s]: Luc4s,
  [Agent.Cresus]: Cresus,
  [Agent.Atlas]: Atlas,
  [Agent.PunkMari]: PunkMari,
  [Agent.Septimus]: Septimus,
  [Agent.DoubleJoe]: DoubleJoe,
  [Agent.DonDune]: DonDune,
  [Agent.V3rn3]: V3rn3,
  [Agent.Ch4mb3rs]: Ch4mb3rs,
  [Agent.Buj0ld]: Buj0ld,
  [Agent.JackCurry]: JackCurry,
  [Agent.C1x1n]: C1x1n,
  [Agent.LadyMoore]: LadyMoore,
  [Agent.L0v3cr4ft]: L0v3cr4ft,
  [Agent.Suleiman]: Suleiman,
  [Agent.Annie]: Annie,
  [Agent.M4th3s0n]: M4th3s0n,
  [Agent.Gilgamesh]: Gilgamesh,
  [Agent.StessyPower]: StessyPower,
  [Agent.Felis]: Felis,
  [Agent.V4nc3]: V4nc3,
  [Agent.Ramses]: Ramses,
  [Agent.GuyGambler]: GuyGambler,
  [Agent.DocWissen]: DocWissen,
  [Agent.BaronGoro]: BaronGoro,
  [Agent.Ivan]: Ivan,
  [Agent.Br4dbury]: Br4dbury,
  [Agent.F4rm3r]: F4rm3r,
  [Agent.Zenon]: Zenon,
  [Agent.Bish0p]: Bish0p,
  [Agent.Wul]: Wul,
  [Agent.Th0mps0n]: Th0mps0n,
  [Agent.Domitian]: Domitian,
  [Agent.MasterDin]: MasterDin,
  [Agent.LordCreep]: LordCreep,
  [Agent.Amytis]: Amytis,
  [Agent.W4ts0n]: W4ts0n,
  [Agent.Arnulf]: Arnulf,
  [Agent.R0bins0n]: R0bins0n,
  [Agent.QueenSuzanne]: QueenSuzanne,
  [Agent.H4milt0n]: H4milt0n,
  [Agent.Caesar]: Caesar,
  [Agent.IldaFlores]: IldaFlores,
  [Agent.H3rb3rt]: H3rb3rt,
  [Agent.LisaCharity]: LisaCharity,
  [Agent.SirSam]: SirSam,
  [Agent.HiroshiSun]: HiroshiSun,
  [Agent.Magellan]: Magellan,
  [Agent.Bajazet]: Bajazet,
  [Agent.Geta]: Geta,
  [Agent.Charlemagne]: Charlemagne,
  [Agent.Caligula]: Caligula,
  [Agent.Tiberius]: Tiberius,
  [Agent.And3rs0n]: And3rs0n,
  [Agent.Orw3ll]: Orw3ll,
  [Agent.As1m0v]: As1m0v,
  [Agent.HelenaKerr]: HelenaKerr,
  [Agent.LittleBob]: LittleBob,
  [Agent.Bruss0l0]: Bruss0l0,
  [Agent.B4rj4v3l]: B4rj4v3l,
  [Agent.Augustus]: Augustus,
  [Agent.LulaSmart]: LulaSmart,
  [Agent.CharlizeGun]: CharlizeGun,
  [Agent.ProfessorZed]: ProfessorZed,
  [Agent.IceJune]: IceJune,
  [Agent.V4nV0gt]: V4nV0gt,
  [Agent.KingHarold]: KingHarold,
  [Agent.Geronimo]: Geronimo,
  [Agent.W3lls]: W3lls,
  [Agent.Nero]: Nero,
  [Agent.Cl4rke]: Cl4rke,
  [Agent.Chaka]: Chaka,
  [Agent.M4rt1n]: M4rt1n,
  [Agent.Pachacuti]: Pachacuti,
  [Agent.Gibs0n]: Gibs0n,
  [Agent.HandyLuke]: HandyLuke,
  [Agent.Khan]: Khan,
  [Agent.Moussa]: Moussa,
  [Agent.Archimedes]: Archimedes,
  [Agent.SneakyJules]: SneakyJules,
  [Agent.SecretKali]: SecretKali,
  [Agent.CaptainAndreev]: CaptainAndreev,
  [Agent.MiladyJones]: MiladyJones
}
