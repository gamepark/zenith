import { isMoveItemType, isStartPlayerTurn, isStartRule, ItemMove, Material, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Agent } from '../material/Agent'
import { Agents } from '../material/Agents'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { getTeamColor } from '../TeamColor'
import { CreditHelper } from './helper/CreditHelper'
import { EffectHelper } from './helper/EffectHelper'
import { InfluenceHelper } from './helper/InfluenceHelper'
import { PlayerHelper } from './helper/PlayerHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  onRuleStart() {
    this.forget(Memory.DiscardFaction)
    this.forget(Memory.LastPlanetsMoved)
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

  get creditHelper() {
    return new CreditHelper(this.game, this.player)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move)) return []

    if (move.location.type === LocationType.AgentDiscard) {
      const item = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      const agent = Agents[item.id]
      this.memorize(Memory.DiscardFaction, agent.faction)
      return [this.startRule(RuleId.DiscardAction)]
    }

    const moves: MaterialMove[] = []
    if (move.location.type === LocationType.Influence) {
      const influenceHelper = this.influenceHelper
      const item = this.material(MaterialType.AgentCard).getItem<Agent | undefined>(move.itemIndex)
      this.memorize(Memory.CardPlayed, item.id)
      // Here we must add one since the card we just bought is already in place
      // If we put it in beforeItemMove, there is issue since in some case, the card is not known
      const cost = influenceHelper.getCost(item, 1)
      if (cost > 0) {
        moves.push(...this.creditHelper.spendCredit(cost))
      }

      const helper = new EffectHelper(this.game, this.player)
      const effectMoves = helper.applyCard(item)
      if (effectMoves.some((move) => isStartRule(move) || isStartPlayerTurn(move))) {
        moves.push(...effectMoves)
        return moves
      }

      moves.push(this.startRule(RuleId.Refill))
    }
    return moves
  }

  get influenceHelper() {
    return new InfluenceHelper(this.game, getTeamColor(this.player))
  }

  get playerHelper() {
    return new PlayerHelper(this.game, this.player)
  }

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }
}
