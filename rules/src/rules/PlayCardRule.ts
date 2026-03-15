import { CustomMove, isCustomMoveType, isMoveItemType, isStartPlayerTurn, isStartRule, ItemMove, Material, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Agent } from '../material/Agent'
import { Agents } from '../material/Agents'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { CreditHelper } from './helper/CreditHelper'
import { CustomMoveType } from './CustomMoveType'
import { EffectHelper } from './helper/EffectHelper'
import { InfluenceHelper } from './helper/InfluenceHelper'
import { PlayerHelper } from './helper/PlayerHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PlayCardRule extends PlayerTurnRule {
  onRuleStart() {
    this.forget(Memory.DiscardFaction)
    this.forget(Memory.LastPlanetsMoved)
    this.forget(Memory.LastPlanetMove)
    if (!this.hand.length) {
      return [this.startRule(RuleId.Refill)]
    }
    return []
  }

  getPlayerMoves(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const hand = this.hand
    moves.push(...this.discardAgents(hand))
    moves.push(...this.placeInInfluence(hand))
    const playerHelper = this.playerHelper
    for (const index of hand.getIndexes()) {
      const item = hand.getItem<Agent>(index)
      if (item.id !== undefined) {
        if (playerHelper.canDevelopTechnology(Agents[item.id].faction)) {
          moves.push(this.customMove(CustomMoveType.DiscardForTech, index))
        }
      }
      moves.push(this.customMove(CustomMoveType.DiscardForDiplomacy, index))
    }
    return moves
  }

  placeInInfluence(cards: Material) {
    const influenceHelper = this.influenceHelper
    const playerHelper = this.playerHelper
    const is4Players = this.game.players.length === 4
    const allowedPlanets = playerHelper.allowedPlanets

    return cards
      .filter<Agent>((item) => {
        // Check credit cost
        if (influenceHelper.getCost(item) > playerHelper.credits) return false
        // In 4-player mode, restrict to allowed planets based on player side
        if (is4Players) {
          const cardPlanet = Agents[item.id as Agent].influence
          if (!allowedPlanets.includes(cardPlanet)) return false
        }
        return true
      })
      .moveItems((item) => ({
        type: LocationType.Influence,
        id: Agents[item.id as Agent].influence,
        player: this.playerHelper.team
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

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.DiscardForTech)(move)) {
      const card = this.material(MaterialType.AgentCard).index(move.data)
      this.forget(Memory.TeamFirst)
      this.memorize(Memory.DiscardChoice, CustomMoveType.DiscardForTech)
      return [card.moveItem({ type: LocationType.AgentDiscard })]
    }
    if (isCustomMoveType(CustomMoveType.DiscardForDiplomacy)(move)) {
      const card = this.material(MaterialType.AgentCard).index(move.data)
      this.forget(Memory.TeamFirst)
      this.memorize(Memory.DiscardChoice, CustomMoveType.DiscardForDiplomacy)
      return [card.moveItem({ type: LocationType.AgentDiscard })]
    }
    return []
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move)) return []

    // Clear speech bubble when the chosen player plays their card
    this.forget(Memory.TeamFirst)

    if (move.location.type === LocationType.AgentDiscard) {
      const item = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      const agent = Agents[item.id]
      this.memorize(Memory.DiscardFaction, agent.faction)
      const choice = this.remind(Memory.DiscardChoice)
      this.forget(Memory.DiscardChoice)
      if (choice === CustomMoveType.DiscardForTech) {
        return [this.startRule(RuleId.TechnologyAction)]
      }
      if (choice === CustomMoveType.DiscardForDiplomacy) {
        return [this.startRule(RuleId.DiplomacyAction)]
      }
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
    return new InfluenceHelper(this.game, this.playerHelper.team)
  }

  get playerHelper() {
    return new PlayerHelper(this.game, this.player)
  }

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }
}
