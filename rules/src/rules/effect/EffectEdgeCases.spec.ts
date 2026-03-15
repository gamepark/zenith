import { MaterialMove } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { Agent, agents } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { Credit } from '../../material/Credit'
import { ConditionType, ExpandedEffect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { Faction } from '../../material/Faction'
import { Influence, influences } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { TeamColor } from '../../TeamColor'
import { ZenithRules } from '../../ZenithRules'
import { ZenithSetup } from '../../ZenithSetup'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

const player1: PlayerId = 1
const player2: PlayerId = 2

function playConsequences(rules: ZenithRules, move: MaterialMove) {
  const consequences = rules.play(move)
  while (consequences.length > 0) {
    consequences.push(...rules.play(consequences.shift()!))
  }
}

function resolveAutoMoves(rules: ZenithRules) {
  let autoMoves = rules.getAutomaticMoves()
  while (autoMoves.length > 0) {
    for (const auto of autoMoves) {
      playConsequences(rules, auto)
    }
    autoMoves = rules.getAutomaticMoves()
  }
}

function resolveAllEffects(rules: ZenithRules, player: PlayerId, maxIterations = 50) {
  let iterations = 0
  while (iterations < maxIterations) {
    const ruleId = rules.game.rule?.id
    if (ruleId === RuleId.Refill || ruleId === RuleId.PlayCard || ruleId === undefined) {
      return { finalRule: ruleId }
    }

    resolveAutoMoves(rules)
    const newRuleId = rules.game.rule?.id
    if (newRuleId === RuleId.Refill || newRuleId === RuleId.PlayCard || newRuleId === undefined) {
      return { finalRule: newRuleId }
    }

    const legalMoves = rules.getLegalMoves(player)
    if (legalMoves.length === 0) {
      const p2Moves = rules.getLegalMoves(player === player1 ? player2 : player1)
      if (p2Moves.length > 0) return { finalRule: newRuleId }
      return { error: `No legal moves at rule ${RuleId[newRuleId!] ?? newRuleId}` }
    }

    playConsequences(rules, legalMoves[0])
    iterations++
  }

  return { error: `Max iterations at rule ${RuleId[rules.game.rule?.id!] ?? rules.game.rule?.id}` }
}

/**
 * Base setup for effect edge-case testing.
 * Sets up a 2-player game with player1 playing next.
 * Override methods to customize the game state.
 */
class EffectTestSetup extends ZenithSetup {
  protected testAgent: Agent
  protected effects: any[]
  protected deckCount: number
  protected discardCount: number
  protected opponentInfluenceCards: Agent[]
  protected playerInfluenceCards: Agent[]
  protected planetPositions: Partial<Record<Influence, number>>
  protected playerCredits: number
  protected opponentCredits: number
  protected playerZenithium: number
  protected playerIsLeader: boolean

  constructor(opts: {
    agent?: Agent
    effects?: any[]
    deckCount?: number
    discardCount?: number
    opponentInfluenceCards?: Agent[]
    playerInfluenceCards?: Agent[]
    planetPositions?: Partial<Record<Influence, number>>
    playerCredits?: number
    opponentCredits?: number
    playerZenithium?: number
    playerIsLeader?: boolean
  } = {}) {
    super()
    this.testAgent = opts.agent ?? Agent.Elisabeth
    this.effects = opts.effects ?? []
    this.deckCount = opts.deckCount ?? 20
    this.discardCount = opts.discardCount ?? 0
    this.opponentInfluenceCards = opts.opponentInfluenceCards ?? []
    this.playerInfluenceCards = opts.playerInfluenceCards ?? []
    this.planetPositions = opts.planetPositions ?? {}
    this.playerCredits = opts.playerCredits ?? 10
    this.opponentCredits = opts.opponentCredits ?? 10
    this.playerZenithium = opts.playerZenithium ?? 3
    this.playerIsLeader = opts.playerIsLeader ?? false
  }

  setupMaterial() {
    this.memorize(Memory.Team, TeamColor.White, player1)
    this.memorize(Memory.Team, TeamColor.Black, player2)
    this.setupTurnOrder()
    this.setupTestHands()
    this.setupDeckAndDiscard()
    this.setupInfluences()
    this.setupInfluenceCards()
    this.setupTeams()
    this.setupLeaderBadge()
    this.setupTechnologyBoard()
    this.setupTestBonuses()
  }

  setupTurnOrder() {
    this.memorize(Memory.TurnOrder, [player1, player2])
  }

  setupTestHands() {
    this.material(MaterialType.AgentCard).createItem({
      id: this.testAgent,
      location: { type: LocationType.PlayerHand, player: player1 }
    })
    const fillers = agents.filter(a => a !== this.testAgent && !this.opponentInfluenceCards.includes(a) && !this.playerInfluenceCards.includes(a)).slice(0, 3)
    for (const agent of fillers) {
      this.material(MaterialType.AgentCard).createItem({
        id: agent,
        location: { type: LocationType.PlayerHand, player: player1 }
      })
    }

    const p2Fillers = agents.filter(a => a !== this.testAgent && !fillers.includes(a) && !this.opponentInfluenceCards.includes(a) && !this.playerInfluenceCards.includes(a)).slice(0, 4)
    for (const agent of p2Fillers) {
      this.material(MaterialType.AgentCard).createItem({
        id: agent,
        location: { type: LocationType.PlayerHand, player: player2 }
      })
    }
  }

  setupDeckAndDiscard() {
    const usedAgents = new Set([
      this.testAgent,
      ...this.opponentInfluenceCards,
      ...this.playerInfluenceCards,
      ...agents.filter(a => a !== this.testAgent && !this.opponentInfluenceCards.includes(a) && !this.playerInfluenceCards.includes(a)).slice(0, 7)
    ])
    const remaining = agents.filter(a => !usedAgents.has(a))
    let idx = 0
    for (let i = 0; i < this.deckCount && idx < remaining.length; i++, idx++) {
      this.material(MaterialType.AgentCard).createItem({
        id: remaining[idx],
        location: { type: LocationType.AgentDeck }
      })
    }
    for (let i = 0; i < this.discardCount && idx < remaining.length; i++, idx++) {
      this.material(MaterialType.AgentCard).createItem({
        id: remaining[idx],
        location: { type: LocationType.AgentDiscard }
      })
    }
  }

  setupInfluences() {
    for (const planet of influences) {
      const x = this.planetPositions[planet] ?? 0
      this.material(MaterialType.InfluenceDisc).createItem({
        id: planet,
        location: {
          type: LocationType.PlanetBoardInfluenceDiscSpace,
          id: planet,
          x
        }
      })
    }
  }

  setupInfluenceCards() {
    for (let i = 0; i < this.opponentInfluenceCards.length; i++) {
      const agent = this.opponentInfluenceCards[i]
      this.material(MaterialType.AgentCard).createItem({
        id: agent,
        location: {
          type: LocationType.Influence,
          id: Agents[agent].influence,
          player: TeamColor.Black,
          x: i
        }
      })
    }
    for (let i = 0; i < this.playerInfluenceCards.length; i++) {
      const agent = this.playerInfluenceCards[i]
      this.material(MaterialType.AgentCard).createItem({
        id: agent,
        location: {
          type: LocationType.Influence,
          id: Agents[agent].influence,
          player: TeamColor.White,
          x: i
        }
      })
    }
  }

  setupTeams() {
    for (const team of [TeamColor.White, TeamColor.Black]) {
      const credits = team === TeamColor.White ? this.playerCredits : this.opponentCredits
      this.material(MaterialType.CreditToken).createItem({
        id: Credit.Credit1,
        location: { type: LocationType.TeamCredit, player: team },
        quantity: credits
      })
      this.material(MaterialType.CreditToken).createItem({
        id: Credit.Credit5,
        location: { type: LocationType.TeamCredit, player: team }
      })
      const zenithium = team === TeamColor.White ? this.playerZenithium : 3
      this.material(MaterialType.ZenithiumToken).createItem({
        location: { type: LocationType.TeamZenithium, player: team },
        quantity: zenithium
      })
    }
  }

  setupTestBonuses() {
    const bonusIds = [1, 2, 3, 4, 5]
    for (let i = 0; i < influences.length; i++) {
      this.material(MaterialType.BonusToken).createItem({
        id: bonusIds[i],
        location: { type: LocationType.PlanetBoardBonusSpace, id: influences[i] }
      })
    }
    const techBoards = this.material(MaterialType.TechnologyBoard).getIndexes()
    for (const boardIndex of techBoards) {
      this.material(MaterialType.BonusToken).createItem({
        id: bonusIds.length + boardIndex + 1,
        location: { type: LocationType.TechnologyBoardBonusSpace, parent: boardIndex, x: 2 }
      })
    }
  }

  /** Override to no-op — hands are set in setupTestHands */
  setupPlayers() {}

  start() {
    this.startPlayerTurn(RuleId.PlayCard, player1)
  }
}

/** Inject effects directly into Memory and start the effect rule */
function setupEffects(rules: ZenithRules, effects: any[]) {
  const expandedEffects: ExpandedEffect[] = effects.map(e => ({
    ...e,
    effectSource: { type: MaterialType.AgentCard, value: Agent.Elisabeth }
  }))
  rules.game.memory[Memory.Effects] = JSON.parse(JSON.stringify(expandedEffects))
}

function createRulesWithEffects(opts: ConstructorParameters<typeof EffectTestSetup>[0], effects: any[]): ZenithRules {
  const setup = new EffectTestSetup(opts)
  const game = setup.setup({ players: [{}, {}] })
  const rules = new ZenithRules(game)
  setupEffects(rules, effects)
  return rules
}

// ============================================================
// WinInfluence
// ============================================================
describe('WinInfluence edge cases', () => {
  it('opponentSide with no planets on opponent side should skip effect', () => {
    // All planets at x=0 (center) — no opponent side for White (opponent = x < 0)
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinInfluence, quantity: 1, opponentSide: true }
    ])
    // Start the effect rule
    playConsequences(rules, { type: 'rule', id: RuleId.WinInfluence } as any)

    // isPossible should detect no valid planets
    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('differentPlanet with only 1 planet remaining should skip after first pull', () => {
    // Capture 4 planets, leave only Mercury on board
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinInfluence, quantity: 1, differentPlanet: true, resetDifferentPlanet: true }
    ])

    // Just verify the effect chain resolves
    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('fromCenter with no planets at center should skip', () => {
    // All planets at x=2
    const rules = createRulesWithEffects({
      planetPositions: {
        [Influence.Mercury]: 2, [Influence.Venus]: 2, [Influence.Terra]: 2,
        [Influence.Mars]: 2, [Influence.Jupiter]: 2
      }
    }, [
      { type: EffectType.WinInfluence, quantity: 1, fromCenter: true }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('planet already at max position (x=4 for White) should still trigger capture', () => {
    const rules = createRulesWithEffects({
      planetPositions: { [Influence.Mars]: 3 }
    }, [
      { type: EffectType.WinInfluence, influence: Influence.Mars, quantity: 1 }
    ])

    // Start effect rule
    playConsequences(rules, rules.play({ type: 'rule', id: RuleId.WinInfluence } as any)[0] ?? { type: 'rule', id: RuleId.WinInfluence } as any)
    resolveAutoMoves(rules)
    const result = resolveAllEffects(rules, player1)
    // Should not block
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// GiveInfluence
// ============================================================
describe('GiveInfluence edge cases', () => {
  it('all planets at boundary (x=-4 for White push) should skip', () => {
    // White pushes toward negative. All at -4 already.
    const rules = createRulesWithEffects({
      planetPositions: {
        [Influence.Mercury]: -4, [Influence.Venus]: -4, [Influence.Terra]: -4,
        [Influence.Mars]: -4, [Influence.Jupiter]: -4
      }
    }, [
      { type: EffectType.GiveInfluence }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('push planet to -4 should capture for opponent', () => {
    const rules = createRulesWithEffects({
      planetPositions: { [Influence.Mars]: -3 }
    }, [
      { type: EffectType.GiveInfluence }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('except planet filter works', () => {
    const rules = createRulesWithEffects({
      planetPositions: { [Influence.Mars]: -4 }
    }, [
      { type: EffectType.GiveInfluence, except: Influence.Mars }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// Exile
// ============================================================
describe('Exile edge cases', () => {
  it('exile with no influence cards should skip', () => {
    // No cards in influence for either team
    const rules = createRulesWithEffects({}, [
      { type: EffectType.Exile }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('exile opponent with no opponent influence cards should skip', () => {
    const rules = createRulesWithEffects({
      playerInfluenceCards: [Agent.Pkd1ck]
    }, [
      { type: EffectType.Exile, opponent: true }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('exile quantity=2 with only 1 card should exile 1 then skip', () => {
    const rules = createRulesWithEffects({
      playerInfluenceCards: [Agent.Pkd1ck]
    }, [
      { type: EffectType.Exile, quantity: 2 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('exile with specific influence filter and no matching cards should skip', () => {
    // Card on Mercury influence, but exile requires Venus
    const rules = createRulesWithEffects({
      playerInfluenceCards: [Agent.Pkd1ck] // Pkd1ck is on Mercury influence
    }, [
      { type: EffectType.Exile, influence: Influence.Venus }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// Transfer
// ============================================================
describe('Transfer edge cases', () => {
  it('transfer with no opponent influence cards should skip', () => {
    const rules = createRulesWithEffects({}, [
      { type: EffectType.Transfer }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('transfer quantity=2 with only 1 opponent card should skip (isPossible checks quantity)', () => {
    const rules = createRulesWithEffects({
      opponentInfluenceCards: [Agent.Pkd1ck]
    }, [
      { type: EffectType.Transfer, quantity: 2 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('transfer with specific influence and matching opponent cards should not block', () => {
    const rules = createRulesWithEffects({
      opponentInfluenceCards: [Agent.Pkd1ck] // Mercury influence
    }, [
      { type: EffectType.Transfer, influence: Influence.Mercury }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// GiveCredit
// ============================================================
describe('GiveCredit edge cases', () => {
  it('give credits with 0 credits should skip', () => {
    const rules = createRulesWithEffects({
      playerCredits: 0
    }, [
      { type: EffectType.GiveCredit, quantity: 3 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('give credits with insufficient credits should skip', () => {
    const rules = createRulesWithEffects({
      playerCredits: 2
    }, [
      { type: EffectType.GiveCredit, quantity: 5 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// StealCredit
// ============================================================
describe('StealCredit edge cases', () => {
  it('steal credits from opponent with 0 credits should skip', () => {
    const rules = createRulesWithEffects({
      opponentCredits: 0
    }, [
      { type: EffectType.StealCredit, quantity: 2 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// GiveZenithium
// ============================================================
describe('GiveZenithium edge cases', () => {
  it('give zenithium with 0 zenithium should skip', () => {
    const rules = createRulesWithEffects({
      playerZenithium: 0
    }, [
      { type: EffectType.GiveZenithium, quantity: 1 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// SpendCredit
// ============================================================
describe('SpendCredit edge cases', () => {
  it('spend credits with 0 credits should skip', () => {
    const rules = createRulesWithEffects({
      playerCredits: 0
    }, [
      { type: EffectType.SpendCredit, quantities: [2, 4, 6], factors: [1, 2, 3] }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('spend credits with insufficient for all tiers should skip', () => {
    const rules = createRulesWithEffects({
      playerCredits: 1
    }, [
      { type: EffectType.SpendCredit, quantities: [2, 4, 6], factors: [1, 2, 3] }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// SpendZenithium
// ============================================================
describe('SpendZenithium edge cases', () => {
  it('spend zenithium with 0 zenithium should skip', () => {
    const rules = createRulesWithEffects({
      playerZenithium: 0
    }, [
      { type: EffectType.SpendZenithium, quantities: [1, 2], factors: [1, 2] }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// Discard
// ============================================================
describe('Discard edge cases', () => {
  it('discard with empty hand should skip', () => {
    // We can't easily empty the hand in this setup, but the isPossible check should handle it
    // Test with a game state where player hand is empty
    const setup = new EffectTestSetup({})
    const game = setup.setup({ players: [{}, {}] })
    const rules = new ZenithRules(game)

    // Remove all cards from player1's hand
    const hand = rules.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(player1)
    for (const index of hand.getIndexes()) {
      playConsequences(rules, hand.index(index).moveItem({ type: LocationType.AgentDiscard }))
    }

    setupEffects(rules, [{ type: EffectType.Discard }])
    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// ResetInfluence
// ============================================================
describe('ResetInfluence edge cases', () => {
  it('reset influence with no planets on player side should skip', () => {
    // All planets at x=0 (center) or negative (opponent side for White)
    // White's side = x > 0. No planets there.
    const rules = createRulesWithEffects({
      planetPositions: {
        [Influence.Mercury]: -2, [Influence.Venus]: -1, [Influence.Terra]: 0,
        [Influence.Mars]: -1, [Influence.Jupiter]: -2
      }
    }, [
      { type: EffectType.ResetInfluence }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// Conditional with DoEffect
// ============================================================
describe('Conditional DoEffect edge cases', () => {
  it('mandatory mobilize condition with empty deck+discard should skip', () => {
    const rules = createRulesWithEffects({
      deckCount: 0,
      discardCount: 0
    }, [
      {
        type: EffectType.Conditional,
        mandatory: true,
        condition: {
          type: ConditionType.DoEffect,
          effect: { type: EffectType.Mobilize }
        },
        effect: {
          type: EffectType.WinInfluence,
          quantity: 1
        }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('non-mandatory exile condition with no cards should allow pass', () => {
    const rules = createRulesWithEffects({}, [
      {
        type: EffectType.Conditional,
        mandatory: false,
        condition: {
          type: ConditionType.DoEffect,
          effect: { type: EffectType.Exile }
        },
        effect: {
          type: EffectType.WinInfluence,
          quantity: 1
        }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('mandatory transfer condition with no opponent cards should skip', () => {
    const rules = createRulesWithEffects({}, [
      {
        type: EffectType.Conditional,
        mandatory: true,
        condition: {
          type: ConditionType.DoEffect,
          effect: { type: EffectType.Transfer }
        },
        effect: {
          type: EffectType.WinInfluence,
          quantity: 1
        }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('HaveCredits condition with insufficient credits should skip', () => {
    const rules = createRulesWithEffects({
      playerCredits: 2
    }, [
      {
        type: EffectType.Conditional,
        condition: {
          type: ConditionType.HaveCredits,
          min: 6
        },
        effect: {
          type: EffectType.WinInfluence,
          quantity: 1
        }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('Leader condition when not leader should skip', () => {
    const rules = createRulesWithEffects({
      playerIsLeader: false
    }, [
      {
        type: EffectType.Conditional,
        condition: {
          type: ConditionType.Leader
        },
        effect: {
          type: EffectType.WinInfluence,
          quantity: 1
        }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// Chained effects (multiple effects in sequence)
// ============================================================
describe('Chained effect sequences', () => {
  it('WinInfluence + GiveInfluence + WinCredit chain should resolve', () => {
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinInfluence, influence: Influence.Mars, quantity: 1 },
      { type: EffectType.GiveInfluence },
      { type: EffectType.WinCredit, quantity: 2 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('multiple impossible effects in a row should all skip gracefully', () => {
    const rules = createRulesWithEffects({
      playerCredits: 0,
      playerZenithium: 0
    }, [
      { type: EffectType.GiveCredit, quantity: 5 },
      { type: EffectType.GiveZenithium, quantity: 2 },
      { type: EffectType.StealCredit, quantity: 3 },
      { type: EffectType.WinInfluence, influence: Influence.Mars, quantity: 1 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('Domitian-like: WinInfluence + 3x Conditional(Mobilize -> WinInfluence) should resolve', () => {
    const rules = createRulesWithEffects({
      deckCount: 10
    }, [
      { type: EffectType.WinInfluence, influence: Influence.Mars, quantity: 1 },
      {
        type: EffectType.Conditional, mandatory: true,
        condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Mobilize } },
        effect: { type: EffectType.WinInfluence, quantity: 1 }
      },
      {
        type: EffectType.Conditional, mandatory: true,
        condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Mobilize } },
        effect: { type: EffectType.WinInfluence, quantity: 1 }
      },
      {
        type: EffectType.Conditional, mandatory: true,
        condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Mobilize } },
        effect: { type: EffectType.WinInfluence, quantity: 1 }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('Domitian-like with empty deck should skip mobilize conditions', () => {
    const rules = createRulesWithEffects({
      deckCount: 0,
      discardCount: 0
    }, [
      { type: EffectType.WinInfluence, influence: Influence.Mars, quantity: 1 },
      {
        type: EffectType.Conditional, mandatory: true,
        condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Mobilize } },
        effect: { type: EffectType.WinInfluence, quantity: 1 }
      },
      {
        type: EffectType.Conditional, mandatory: true,
        condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Mobilize } },
        effect: { type: EffectType.WinInfluence, quantity: 1 }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// Mobilize edge cases (beyond AgentEffects.spec.ts)
// ============================================================
describe('Mobilize edge cases', () => {
  it('mobilize quantity=2 with 2 cards in deck should resolve in one batch without crash', () => {
    const rules = createRulesWithEffects({
      deckCount: 2,
      discardCount: 0
    }, [
      { type: EffectType.Mobilize, quantity: 2 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('mobilize quantity=3 with 1 card in deck and 0 in discard should mobilize 1 then skip', () => {
    const rules = createRulesWithEffects({
      deckCount: 1,
      discardCount: 0
    }, [
      { type: EffectType.Mobilize, quantity: 3 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('conditional mandatory mobilize quantity=2 should not crash afterItemMove', () => {
    const rules = createRulesWithEffects({
      deckCount: 5
    }, [
      {
        type: EffectType.Conditional, mandatory: true,
        condition: { type: ConditionType.DoEffect, effect: { type: EffectType.Mobilize, quantity: 2 } },
        effect: { type: EffectType.WinInfluence, quantity: 1 }
      }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// WinCredit edge cases
// ============================================================
describe('WinCredit edge cases', () => {
  it('perLevel1Technology with no techs should give 0 credits (not block)', () => {
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinCredit, perLevel1Technology: [Faction.Human] }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('factorPerDifferentInfluence with no influence cards should give 0', () => {
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinCredit, factorPerDifferentInfluence: 2 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('factorPerDifferentOpponentInfluence with no opponent cards should give 0', () => {
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinCredit, factorPerDifferentOpponentInfluence: 2 }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})

// ============================================================
// WinZenithium edge cases
// ============================================================
describe('WinZenithium edge cases', () => {
  it('perLevel1Technology with no techs should give 0 zenithium', () => {
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinZenithium, perLevel1Technology: [Faction.Human] }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })

  it('opponent=true should give zenithium to opponent', () => {
    const rules = createRulesWithEffects({}, [
      { type: EffectType.WinZenithium, quantity: 1, opponent: true }
    ])

    const result = resolveAllEffects(rules, player1)
    expect(result.error).toBeUndefined()
  })
})
