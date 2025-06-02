import { isMoveItemType, ItemMove, Material, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Agent } from '../material/Agent'
import { Agents } from '../material/Agents'
import { credits } from '../material/Credit'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getTeamColor } from '../TeamColor'
import { InfluenceHelper } from './helper/InfluenceHelper'
import { PlayerHelper } from './helper/PlayerHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  onRuleStart() {
    this.forget(Memory.DiscardFaction)
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const hand = this.hand
    moves.push(...this.discardAgents(hand))
    moves.push(...this.placeInInfluence(hand))
    return moves
  }

  placeInInfluence(cards: Material) {
    const influenceHelper = this.influenceHelper
    const playerHelper = this.playerHelper
    return cards
      .filter<Agent>((item) => influenceHelper.getCost(item) <= playerHelper.credits)
      .moveItems((item) => ({
        type: LocationType.Influence,
        id: Agents[item.id as Agent].influence,
        player: getTeamColor(this.player)
      }))
  }

  discardAgents(cards: Material) {
    return cards.moveItems({
      type: LocationType.AgentDiscard
    })
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move)) return []
    const moves: MaterialMove[] = []
    if (move.location.type === LocationType.Influence) {
      const influenceHelper = this.influenceHelper
      const playerHelper = this.playerHelper
      const item = this.material(MaterialType.AgentCard).getItem<Agent | undefined>(move.itemIndex)
      if (!item.id) return moves
      const cost = influenceHelper.getCost(item)
      if (cost > 0) {
        moves.push(...this.creditMoney.removeMoney(cost, { type: LocationType.TeamCredit, player: playerHelper.team }))
      }
      moves.push(this.startPlayerTurn(RuleId.PlayCard, this.nextPlayer))
    }

    return moves
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.AgentDiscard) return []
    const item = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
    const agent = Agents[item.id]
    this.memorize(Memory.DiscardFaction, agent.faction)
    return [this.startRule(RuleId.DiscardAction)]
  }

  get creditMoney() {
    return this.material(MaterialType.CreditToken).money(credits)
  }

  get influenceHelper() {
    return new InfluenceHelper(this.game, this.player)
  }

  get playerHelper() {
    return new PlayerHelper(this.game, this.player)
  }

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }
}
