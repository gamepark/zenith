import { isCustomMoveType, isMoveItemType, isStartPlayerTurn, MaterialMove, MoveKind } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { Agent, agents } from '../../material/Agent'
import { Bonus } from '../../material/Bonus'
import { EffectType } from '../../material/effect/EffectType'
import { BonusHelper } from '../helper/BonusHelper'
import { PlayerHelper } from '../helper/PlayerHelper'
import { CustomMoveType } from '../CustomMoveType'
import { Credit, credits } from '../../material/Credit'
import { Influence, influences } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { TeamColor } from '../../TeamColor'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'
import { ZenithRules } from '../../ZenithRules'
import { ZenithSetup } from '../../ZenithSetup'

const player1: PlayerId = 1
const player2: PlayerId = 2

/**
 * White plays Titus (WinInfluence Mars, GiveInfluence except Mars, WinCredit 10).
 * Terra starts at x=-3, so the "give" pushes it to -4 and Black captures it.
 * A configurable bonus token sits on Terra.
 */
class GiveCaptureBonusSetup extends ZenithSetup {
  // Terra x at start; -3 => "give" pushes it to -4 and Black captures it. 0 => no capture.
  protected terraX = -3
  protected bonus: Bonus = Bonus.Win4Credits

  setupMaterial() {
    this.memorize(Memory.Team, TeamColor.White, player1)
    this.memorize(Memory.Team, TeamColor.Black, player2)
    this.memorize(Memory.TurnOrder, [player1, player2])

    this.material(MaterialType.AgentCard).createItem({ id: Agent.Titus, location: { type: LocationType.PlayerHand, player: player1 } })
    const fillers = agents.filter((a) => a !== Agent.Titus).slice(0, 3)
    for (const agent of fillers) this.material(MaterialType.AgentCard).createItem({ id: agent, location: { type: LocationType.PlayerHand, player: player1 } })
    const p2Fillers = agents.filter((a) => a !== Agent.Titus && !fillers.includes(a)).slice(0, 4)
    for (const agent of p2Fillers) this.material(MaterialType.AgentCard).createItem({ id: agent, location: { type: LocationType.PlayerHand, player: player2 } })
    const used = new Set([Agent.Titus, ...fillers, ...p2Fillers])
    for (const agent of agents.filter((a) => !used.has(a))) this.material(MaterialType.AgentCard).createItem({ id: agent, location: { type: LocationType.AgentDeck } })

    for (const planet of influences) {
      this.material(MaterialType.InfluenceDisc).createItem({
        id: planet,
        location: { type: LocationType.PlanetBoardInfluenceDiscSpace, id: planet, x: planet === Influence.Terra ? this.terraX : 0 }
      })
    }

    this.setupLeaderBadge()
    this.setupTechnologyBoard()

    for (const team of [TeamColor.White, TeamColor.Black]) {
      this.material(MaterialType.CreditToken).createItem({ id: Credit.Credit1, location: { type: LocationType.TeamCredit, player: team }, quantity: 10 })
      this.material(MaterialType.ZenithiumToken).createItem({ location: { type: LocationType.TeamZenithium, player: team }, quantity: 3 })
    }

    this.material(MaterialType.BonusToken).createItem({ id: this.bonus, location: { type: LocationType.PlanetBoardBonusSpace, id: Influence.Terra } })
  }

  setupPlayers() {}

  start() {
    this.startPlayerTurn(RuleId.PlayCard, player1)
  }
}

class NoCaptureSetup extends GiveCaptureBonusSetup {
  protected terraX = 0
}

class WinInfluenceBonusSetup extends GiveCaptureBonusSetup {
  protected bonus = Bonus.WinInfluence
}

class NoCaptureWinInfluenceSetup extends WinInfluenceBonusSetup {
  protected terraX = 0
}

type AppliedMove = { move: MaterialMove; player: PlayerId | undefined }

/**
 * Plays a move and all of its consequences exactly like the engine: depth-first, prepending
 * each move's consequences to the front of the queue (see `applyAutomaticMoves`). Records the
 * rule player active when each move is played (what the log uses to attribute it).
 */
function drive(rules: ZenithRules, initial: MaterialMove | undefined, log: AppliedMove[]) {
  const stack: MaterialMove[] = initial ? [JSON.parse(JSON.stringify(initial))] : []
  let fuse = 0
  while (true) {
    if (++fuse > 10000) throw new Error('Infinite loop while draining consequences')
    if (stack.length === 0) stack.push(...rules.getAutomaticMoves())
    const move = stack.shift()
    if (!move) break
    log.push({ move, player: rules.game.rule?.player })
    const consequences = rules.play(JSON.parse(JSON.stringify(move))) ?? []
    stack.unshift(...consequences)
  }
}

function playTitusUntilStable(rules: ZenithRules, log: AppliedMove[]) {
  const cardIndex = rules.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(player1).id(Agent.Titus).getIndex()
  const playMove = rules.material(MaterialType.AgentCard).index(cardIndex).moveItem({ type: LocationType.Influence, id: Influence.Terra, player: TeamColor.White })
  drive(rules, playMove, log)

  let iterations = 0
  while (iterations++ < 60) {
    const ruleId = rules.game.rule?.id
    if (ruleId === RuleId.Refill || ruleId === RuleId.PlayCard || rules.game.rule === undefined) break
    const active = rules.getActivePlayer()!
    const moves = rules.getLegalMoves(active)
    if (moves.length === 0) break
    // Prefer pushing Terra so it crosses into Black's zone and triggers the capture.
    const terraPush = moves.find((m) => isMoveItemType(MaterialType.InfluenceDisc)(m) && rules.material(MaterialType.InfluenceDisc).getItem(m.itemIndex).id === Influence.Terra)
    drive(rules, terraPush ?? moves[0], log)
  }
}

function creditsOf(rules: ZenithRules, team: TeamColor) {
  return rules.material(MaterialType.CreditToken).money(credits).player(team).count
}

function isBonusDiscard(move: MaterialMove) {
  return isMoveItemType(MaterialType.BonusToken)(move) && move.location.type === LocationType.BonusDiscard
}

describe('Give-capture planet bonus', () => {
  it('awards a captured "given" planet credit bonus to the capturing (opponent) team', () => {
    const game = new GiveCaptureBonusSetup().setup({ players: [{}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })
    const rules = new ZenithRules(game)

    const whiteBefore = creditsOf(rules, TeamColor.White)
    const blackBefore = creditsOf(rules, TeamColor.Black)

    const log: AppliedMove[] = []
    playTitusUntilStable(rules, log)

    // Terra captured by Black; bonus token consumed.
    expect(rules.material(MaterialType.InfluenceDisc).location(LocationType.TeamPlanets).player(TeamColor.Black).id(Influence.Terra).length).toBe(1)
    expect(rules.material(MaterialType.BonusToken).location(LocationType.PlanetBoardBonusSpace).locationId(Influence.Terra).length).toBe(0)

    const whiteGain = creditsOf(rules, TeamColor.White) - whiteBefore
    const blackGain = creditsOf(rules, TeamColor.Black) - blackBefore

    // Control: same turn but Terra stays on the board (no capture, no bonus).
    const controlGame = new NoCaptureSetup().setup({ players: [{}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })
    const control = new ZenithRules(controlGame)
    const cWhiteBefore = creditsOf(control, TeamColor.White)
    const cBlackBefore = creditsOf(control, TeamColor.Black)
    playTitusUntilStable(control, [])
    const controlWhiteGain = creditsOf(control, TeamColor.White) - cWhiteBefore
    const controlBlackGain = creditsOf(control, TeamColor.Black) - cBlackBefore

    // Black (the capturing team) gets exactly the +4 bonus; White is unchanged.
    expect(blackGain - controlBlackGain).toBe(4)
    expect(whiteGain).toBe(controlWhiteGain)
  })

  it('orders the moves as capture planet, then discard token, then bonus effect', () => {
    const game = new GiveCaptureBonusSetup().setup({ players: [{}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })
    const rules = new ZenithRules(game)

    const log: AppliedMove[] = []
    playTitusUntilStable(rules, log)

    // Capture = the disc moving into Black's TeamPlanets.
    const captureIndex = log.findIndex(
      (entry) => isMoveItemType(MaterialType.InfluenceDisc)(entry.move) && entry.move.location.type === LocationType.TeamPlanets && entry.move.location.player === TeamColor.Black
    )
    const discardIndex = log.findIndex((entry) => isBonusDiscard(entry.move))
    // The bonus reward is signalled by a WinCreditLog for the capturing team (Black).
    const rewardIndex = log.findIndex((entry) => isCustomMoveType(CustomMoveType.WinCreditLog)(entry.move) && entry.move.data?.team === TeamColor.Black)
    expect(captureIndex).toBeGreaterThanOrEqual(0)
    expect(discardIndex).toBeGreaterThanOrEqual(0)
    expect(rewardIndex).toBeGreaterThanOrEqual(0)
    // Precise order required: capture the planet, then discard the token, then award the bonus.
    expect(captureIndex).toBeLessThan(discardIndex)
    expect(discardIndex).toBeLessThan(rewardIndex)
  })

  it('hands control to the opponent for an interactive bonus (WinInfluence), then returns it', () => {
    const game = new WinInfluenceBonusSetup().setup({ players: [{}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })
    const rules = new ZenithRules(game)
    const whiteBefore = creditsOf(rules, TeamColor.White)

    const log: AppliedMove[] = []
    playTitusUntilStable(rules, log)

    // Terra captured by Black.
    expect(rules.material(MaterialType.InfluenceDisc).location(LocationType.TeamPlanets).player(TeamColor.Black).id(Influence.Terra).length).toBe(1)

    // Control was handed to Black: at least one move was played while Black was the active player.
    expect(log.some((entry) => entry.player === player2)).toBe(true)

    // Control returned to White: its full Titus effect still resolves (same as without the bonus).
    const controlGame = new NoCaptureWinInfluenceSetup().setup({ players: [{}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })
    const control = new ZenithRules(controlGame)
    const cWhiteBefore = creditsOf(control, TeamColor.White)
    playTitusUntilStable(control, [])
    expect(creditsOf(rules, TeamColor.White) - whiteBefore).toBe(creditsOf(control, TeamColor.White) - cWhiteBefore)

    // And the turn ends up back with White (the turn owner) — not stuck on Black.
    if (rules.game.rule?.id === RuleId.Refill) {
      expect(rules.game.rule?.player).toBe(player1)
    }
  })

  it('4 players: hands an interactive bonus to a random opponent via an unpredictable move', () => {
    const game = new ZenithSetup().setup({ players: [{}, {}, {}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })
    const rules = new ZenithRules(game)
    const teamOf = (p: PlayerId) => new PlayerHelper(game, p).team
    const owner = game.players.find((p) => teamOf(p) === teamOf(game.players[0]))!
    const opponents = game.players.filter((p) => teamOf(p) !== teamOf(owner))
    expect(opponents.length).toBe(2)

    // Simulate reaching the point where an opponent-resolved bonus must be handed off.
    game.memory[Memory.ActivePlayer] = owner
    game.memory[Memory.Effects] = [{ type: EffectType.WinInfluence, quantity: 1, resolvedByOpponent: true, effectSource: { type: MaterialType.BonusToken, value: Bonus.WinInfluence } }]

    const handMove = { kind: MoveKind.CustomMove, type: CustomMoveType.HandToOpponent } as MaterialMove

    // The client cannot predict which opponent is drawn.
    expect(rules.isUnpredictableMove(handMove, owner)).toBe(true)

    // The server draws one of the two opponents...
    const randomized = rules.randomize(handMove) as any
    expect(opponents).toContain(randomized.data.player)

    // ...and playing it hands the turn (with the bonus rule) to that opponent.
    const consequences = rules.play(randomized)
    const handoff = consequences.find((m) => isStartPlayerTurn(m))
    expect(handoff).toBeDefined()
    expect((handoff as any).player).toBe(randomized.data.player)
    expect((handoff as any).id).toBe(RuleId.WinInfluence)
  })

  it('flags a bonus captured while an opponent resolves as resolvedByOpponent, without redirecting it', () => {
    const game = new GiveCaptureBonusSetup().setup({ players: [{}, {}], animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', secretAgent: false })

    // Simulate White's turn (the active player) with Black currently resolving an effect
    // (e.g. a "win influence" bonus that is about to capture Terra and its Win4Credits token).
    game.memory[Memory.ActivePlayer] = player1
    game.memory[Memory.Effects] = [{ type: EffectType.WinInfluence, effectSource: { type: MaterialType.BonusToken, value: Bonus.WinInfluence } }]
    game.rule = { id: RuleId.WinInfluence, player: player2 }

    new BonusHelper(game).applyInfluenceBonus(Influence.Terra, false)

    const spliced = (game.memory[Memory.Effects] as any[])[1]
    // Flagged so the resolution keeps it with Black (the non-turn player), not White...
    expect(spliced.resolvedByOpponent).toBe(true)
    // ...but NOT redirected via forOpponent: the effect is untouched (no `opponent` flag).
    expect(spliced.type).toBe(EffectType.WinCredit)
    expect(spliced.opponent).toBeUndefined()
  })
})
