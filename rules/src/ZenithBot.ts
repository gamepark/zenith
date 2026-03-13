import { isMoveItemType, isCustomMoveType, MaterialGame, MaterialMove, RandomBot } from '@gamepark/rules-api'
import { Agent } from './material/Agent'
import { Agents } from './material/Agents'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { getAllowedPlanets, getTeamColor } from './TeamColor'
import { CustomMoveType } from './rules/CustomMoveType'
import { InfluenceHelper } from './rules/helper/InfluenceHelper'
import { PlayerHelper } from './rules/helper/PlayerHelper'
import { RuleId } from './rules/RuleId'

type Game = MaterialGame<PlayerId, MaterialType, LocationType>
type Move = MaterialMove<PlayerId, MaterialType, LocationType>

export class ZenithBot extends RandomBot<Game, Move, PlayerId> {
  constructor(playerId: PlayerId) {
    super(ZenithRulesImport, playerId)
  }

  run(game: Game): Move[] {
    const legalMoves = this.getLegalMoves(game)
    if (legalMoves.length <= 1) return super.run(game)

    const ruleId = game.rule?.id as RuleId | undefined
    if (ruleId === RuleId.PlayCard) {
      return [this.pickPlayCardMove(game, legalMoves)]
    }

    if (ruleId === RuleId.Muligan) {
      const passMove = legalMoves.find(m => isCustomMoveType(CustomMoveType.Pass)(m))
      if (passMove) return [passMove]
    }

    return super.run(game)
  }

  pickPlayCardMove(game: Game, moves: Move[]): Move {
    const influenceMoves: Move[] = []
    const techMoves: Move[] = []
    const diploMoves: Move[] = []
    const discardMoves: Move[] = []

    for (const move of moves) {
      if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
        influenceMoves.push(move)
      } else if (isCustomMoveType(CustomMoveType.DiscardForTech)(move)) {
        techMoves.push(move)
      } else if (isCustomMoveType(CustomMoveType.DiscardForDiplomacy)(move)) {
        diploMoves.push(move)
      } else {
        discardMoves.push(move)
      }
    }

    // Priority 1: Place in influence (70% chance if available)
    if (influenceMoves.length > 0 && Math.random() < 0.7) {
      return this.pickBestInfluenceMove(game, influenceMoves)
    }

    // Priority 2: Develop technology (20% chance if available)
    if (techMoves.length > 0 && Math.random() < 0.5) {
      return techMoves[Math.floor(Math.random() * techMoves.length)]
    }

    // Priority 3: Try influence again if we skipped it
    if (influenceMoves.length > 0) {
      return this.pickBestInfluenceMove(game, influenceMoves)
    }

    // Priority 4: Diplomacy
    if (diploMoves.length > 0 && Math.random() < 0.4) {
      return diploMoves[Math.floor(Math.random() * diploMoves.length)]
    }

    // Priority 5: Technology
    if (techMoves.length > 0) {
      return techMoves[Math.floor(Math.random() * techMoves.length)]
    }

    // Priority 6: Diplomacy
    if (diploMoves.length > 0) {
      return diploMoves[Math.floor(Math.random() * diploMoves.length)]
    }

    // Fallback: discard
    return discardMoves[Math.floor(Math.random() * discardMoves.length)]
  }

  pickBestInfluenceMove(game: Game, moves: Move[]): Move {
    const team = getTeamColor(this.player)
    const influenceHelper = new InfluenceHelper(game, team)
    const playerHelper = new PlayerHelper(game, this.player)
    const allowedPlanets = getAllowedPlanets(this.player)
    const credits = playerHelper.credits

    let bestMove = moves[0]
    let bestScore = -Infinity

    for (const move of moves) {
      if (!isMoveItemType(MaterialType.AgentCard)(move)) continue
      const rules = new ZenithRulesImport(game)
      const item = rules.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      if (item.id === undefined) continue
      const agent = Agents[item.id]

      let score = 0

      // Prefer cards that cost less
      const cost = influenceHelper.getCost(item)
      score += (credits - cost) * 2

      // Prefer columns where we have fewer cards
      const columnCount = influenceHelper.getInfluence(agent.influence).length
      score += (5 - columnCount) * 3

      // Prefer our own planets over shared ones
      if (allowedPlanets.includes(agent.influence)) {
        score += 5
      }

      // Bonus for cards with more effects
      score += agent.effects.length

      // Small random factor
      score += Math.random() * 3

      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }
}

export const ai = (game: Game, playerId: PlayerId): Promise<Move[]> => {
  return Promise.resolve(new ZenithBot(playerId).run(game))
}

// Lazy import to avoid circular dependency
import { ZenithRules as ZenithRulesImport } from './ZenithRules'
