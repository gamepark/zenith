import { isMoveItemType, isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { describe, it, expect, beforeEach } from 'vitest'
import { Agent } from '../material/Agent'
import { Influence } from '../material/Influence'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from '../rules/CustomMoveType'
import { Memory } from '../rules/Memory'
import { RuleId } from '../rules/RuleId'
import { TeamColor } from '../TeamColor'
import { ZenithRules } from '../ZenithRules'
import { me, opponent, TutorialSetup } from './TutorialSetup'

function playConsequences(rules: ZenithRules, move: MaterialMove) {
  const consequences = rules.play(move)
  while (consequences.length > 0) {
    const next = consequences.shift()!
    consequences.push(...rules.play(next))
  }
}

function resolveAutoMoves(rules: ZenithRules) {
  let autoMoves = rules.getAutomaticMoves()
  while (autoMoves.length > 0) {
    for (const auto of autoMoves) {
      const c = rules.play(auto)
      const consequences = [...c]
      while (consequences.length > 0) {
        const next = consequences.shift()!
        consequences.push(...rules.play(next))
      }
    }
    autoMoves = rules.getAutomaticMoves()
  }
}

function playAndResolve(rules: ZenithRules, move: MaterialMove) {
  playConsequences(rules, move)
  resolveAutoMoves(rules)
}

function getItems(rules: ZenithRules, type: MaterialType, locationType?: LocationType, player?: number | TeamColor) {
  let mat = rules.material(type)
  if (locationType !== undefined) mat = mat.location(locationType)
  if (player !== undefined) mat = mat.player(player)
  return mat.getItems()
}

function getDiscPosition(rules: ZenithRules, planet: Influence): number | undefined {
  const disc = rules.material(MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace).id(planet).getItem()
  return disc?.location.x
}

describe('TutorialSetup', () => {
  let rules: ZenithRules

  beforeEach(() => {
    const setup = new TutorialSetup()
    const game = setup.setup({ players: [{}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })
    rules = new ZenithRules(game)
  })

  describe('Initial game state', () => {
    it('should have turn order [1, 2]', () => {
      expect(rules.remind(Memory.TurnOrder)).toEqual([me, opponent])
    })

    it('should skip mulligan and start in PlayCard for player 1', () => {
      expect(rules.game.rule?.id).toBe(RuleId.PlayCard)
      expect(rules.getActivePlayer()).toBe(me)
    })

    it('should have correct hand for player 1', () => {
      const hand = getItems(rules, MaterialType.AgentCard, LocationType.PlayerHand, me)
      const ids = hand.map((i) => i.id)
      expect(ids).toContain(Agent.Mc4ffr3y)
      expect(ids).toContain(Agent.Elisabeth)
      expect(ids).toContain(Agent.Titus)
      expect(ids).toContain(Agent.Huxl3y)
      expect(hand).toHaveLength(4)
    })

    it('should have correct hand for player 2', () => {
      const hand = getItems(rules, MaterialType.AgentCard, LocationType.PlayerHand, opponent)
      const ids = hand.map((i) => i.id)
      expect(ids).toContain(Agent.Bruss0l0)
      expect(ids).toContain(Agent.Pkd1ck)
      expect(ids).toContain(Agent.LordCreep)
      expect(ids).toContain(Agent.DonaldSmooth)
      expect(hand).toHaveLength(4)
    })

    it('should have Terra disc at x=-1 and others at x=0', () => {
      expect(getDiscPosition(rules, Influence.Terra)).toBe(-1)
      expect(getDiscPosition(rules, Influence.Mercury)).toBe(0)
      expect(getDiscPosition(rules, Influence.Venus)).toBe(0)
      expect(getDiscPosition(rules, Influence.Mars)).toBe(0)
      expect(getDiscPosition(rules, Influence.Jupiter)).toBe(0)
    })

    it('should have 12 credits and 1 zenithium per team', () => {
      for (const team of [TeamColor.White, TeamColor.Black]) {
        const credits = getItems(rules, MaterialType.CreditToken, LocationType.TeamCredit, team)
        const totalCredits = credits.reduce((sum, item) => {
          return sum + (item.id as number) * (item.quantity ?? 1)
        }, 0)
        expect(totalCredits).toBe(12)

        const zenithium = getItems(rules, MaterialType.ZenithiumToken, LocationType.TeamZenithium, team)
        expect(zenithium).toHaveLength(1)
      }
    })

    it('should have 3 technology boards with markers at x=0', () => {
      const boards = getItems(rules, MaterialType.TechnologyBoard)
      expect(boards).toHaveLength(3)

      for (const team of [TeamColor.White, TeamColor.Black]) {
        const markers = getItems(rules, MaterialType.TechMarker, LocationType.TechnologyBoardTokenSpace, team)
        expect(markers).toHaveLength(3)
        markers.forEach((m) => expect(m.location.x).toBe(0))
      }
    })

    it('should have leader badge on diplomacy board', () => {
      const badge = getItems(rules, MaterialType.LeaderBadgeToken, LocationType.DiplomacyBoardLeaderBadgeSpace)
      expect(badge).toHaveLength(1)
    })

    it('should have remaining agents in deck', () => {
      const deck = getItems(rules, MaterialType.AgentCard, LocationType.AgentDeck)
      // 90 total agents - 8 in hands = 82 in deck
      expect(deck).toHaveLength(82)
    })
  })

  describe('Tutorial flow', () => {
    it('should allow player 1 to recruit Mc4ffr3y', () => {
      const moves = rules.getLegalMoves(me)
      const recruitMc4ffr3y = moves.find(
        (m) =>
          isMoveItemType(MaterialType.AgentCard)(m) &&
          m.location.type === LocationType.Influence &&
          rules.material(MaterialType.AgentCard).getItem(m.itemIndex).id === Agent.Mc4ffr3y
      )
      expect(recruitMc4ffr3y).toBeDefined()
    })

    it('should complete the full tutorial flow with Terra captured', () => {
      // === TURN 1: Player 1 recruits Mc4ffr3y ===
      const recruitMc4ffr3y = rules
        .getLegalMoves(me)
        .find(
          (m) =>
            isMoveItemType(MaterialType.AgentCard)(m) &&
            m.location.type === LocationType.Influence &&
            rules.material(MaterialType.AgentCard).getItem(m.itemIndex).id === Agent.Mc4ffr3y
        )!
      playAndResolve(rules, recruitMc4ffr3y)

      // Mars should have moved toward White zone (+4 direction)
      expect(getDiscPosition(rules, Influence.Mars)).toBe(1)
      // Should now be player 2's turn
      expect(rules.getActivePlayer()).toBe(opponent)

      // === TURN 1: Player 2 recruits Bruss0l0 ===
      const recruitBruss0l0 = rules
        .getLegalMoves(opponent)
        .find(
          (m) =>
            isMoveItemType(MaterialType.AgentCard)(m) &&
            m.location.type === LocationType.Influence &&
            rules.material(MaterialType.AgentCard).getItem(m.itemIndex).id === Agent.Bruss0l0
        )!
      playAndResolve(rules, recruitBruss0l0)

      // Terra: -1 - 1 (Black pushes toward -4) = -2
      expect(getDiscPosition(rules, Influence.Terra)).toBe(-2)
      expect(rules.getActivePlayer()).toBe(me)

      // === TURN 2: Player 1 discards Elisabeth for Animod tech ===
      const discardElisabeth = rules
        .getLegalMoves(me)
        .find(
          (m) =>
            isMoveItemType(MaterialType.AgentCard)(m) &&
            m.location.type === LocationType.AgentDiscard &&
            rules.material(MaterialType.AgentCard).getItem(m.itemIndex).id === Agent.Elisabeth
        )!
      playAndResolve(rules, discardElisabeth)

      // Should be in DiscardAction rule now
      expect(rules.game.rule?.id).toBe(RuleId.DiscardAction)

      // Develop Animod tech (move TechMarker)
      const developAnimod = rules.getLegalMoves(me).find((m) => isMoveItemType(MaterialType.TechMarker)(m))!
      playAndResolve(rules, developAnimod)

      // After tech + refill, it's player 2's turn
      expect(rules.getActivePlayer()).toBe(opponent)

      // === TURN 2: Player 2 discards DonaldSmooth for Human tech ===
      const discardDonaldSmooth = rules
        .getLegalMoves(opponent)
        .find(
          (m) =>
            isMoveItemType(MaterialType.AgentCard)(m) &&
            m.location.type === LocationType.AgentDiscard &&
            rules.material(MaterialType.AgentCard).getItem(m.itemIndex).id === Agent.DonaldSmooth
        )!
      playAndResolve(rules, discardDonaldSmooth)

      expect(rules.game.rule?.id).toBe(RuleId.DiscardAction)

      // Develop Human tech (consequences only — WinInfluence needs player choice)
      const developHuman = rules.getLegalMoves(opponent).find((m) => isMoveItemType(MaterialType.TechMarker)(m))!
      playConsequences(rules, developHuman)

      // Human tech level 1 gives WinInfluence(1) — player 2 must choose a planet
      const chooseTerra = rules
        .getLegalMoves(opponent)
        .find((m) => isMoveItemType(MaterialType.InfluenceDisc)(m) && rules.material(MaterialType.InfluenceDisc).getItem(m.itemIndex).id === Influence.Terra)!
      expect(chooseTerra).toBeDefined()
      playAndResolve(rules, chooseTerra)
      expect(rules.getActivePlayer()).toBe(me)

      // === TURN 3: Player 1 takes Animod leadership ===
      const discardTitus = rules
        .getLegalMoves(me)
        .find(
          (m) =>
            isMoveItemType(MaterialType.AgentCard)(m) &&
            m.location.type === LocationType.AgentDiscard &&
            rules.material(MaterialType.AgentCard).getItem(m.itemIndex).id === Agent.Titus
        )!
      playAndResolve(rules, discardTitus)

      expect(rules.game.rule?.id).toBe(RuleId.DiscardAction)

      // Take diplomacy
      const diplomacy = rules.getLegalMoves(me).find((m) => isCustomMoveType(CustomMoveType.Diplomacy)(m))!
      playAndResolve(rules, diplomacy)

      // Player 1 should now have the leader badge
      const badge = getItems(rules, MaterialType.LeaderBadgeToken, LocationType.TeamLeaderBadge, TeamColor.White)
      expect(badge).toHaveLength(1)

      // Should be player 2's turn now
      expect(rules.getActivePlayer()).toBe(opponent)

      // === TURN 3: Player 2 recruits LordCreep ===
      const recruitLordCreep = rules
        .getLegalMoves(opponent)
        .find(
          (m) =>
            isMoveItemType(MaterialType.AgentCard)(m) &&
            m.location.type === LocationType.Influence &&
            rules.material(MaterialType.AgentCard).getItem(m.itemIndex).id === Agent.LordCreep
        )!
      playAndResolve(rules, recruitLordCreep)

      // Terra should be captured: disc moved to TeamPlanets for Black
      const blackPlanets = getItems(rules, MaterialType.InfluenceDisc, LocationType.TeamPlanets, TeamColor.Black)
      const terraCaptured = blackPlanets.some((item) => item.id === Influence.Terra)
      expect(terraCaptured).toBe(true)
    })
  })
})
