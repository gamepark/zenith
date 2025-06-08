import { isMoveItemType, isMoveItemTypeAtOnce, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { ExileEffect } from '../../material/effect/Effect'
import { influences } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class ExileRule extends EffectRule<ExileEffect> {
  isPossible(): boolean {
    return this.getPlayerMoves().length > 0
  }

  getPlayerMoves() {
    if (this.effect.quantities) {
      return this.exileMultipleCards()
    }

    return this.exileOneCard()
  }

  decrement(move: ItemMove): boolean {
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard) {
      if (this.effect.quantity) {
        this.effect.quantity--
        return this.effect.quantity === 0
      }
    }

    return true
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard) {
      if (this.effect.quantity) {
        this.effect.quantity--
      }

      if (!this.effect.quantity) {
        this.removeFirstEffect()
        return this.afterEffectPlayed()
      }
    }

    return []
  }

  getExtraDataFromMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard) {
      const card = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      const agent = Agents[card.id]
      return { quantity: agent.cost, influence: agent.influence }
    }

    if (isMoveItemTypeAtOnce(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard) {
      if (this.effect.quantities && this.effect.factors) {
        const index = this.effect.quantities.indexOf(move.indexes.length)
        return { quantity: this.effect.factors[index] }
      }
    }

    return {}
  }

  exileOneCard() {
    const allInfluences = influences
    const allCards = this.material(MaterialType.AgentCard).location(LocationType.Influence)
    const indexes: number[] = []
    for (const influence of allInfluences) {
      if (this.effect.except && this.effect.influence === influence) continue
      if (this.effect.influence && this.effect.influence !== influence) continue
      const influenceCards = allCards.player((p) => (this.effect.opponent ? p !== this.playerHelper.team : p === this.playerHelper.team)).locationId(influence)
      indexes.push(...influenceCards.maxBy((item) => item.location.x!).getIndexes())
    }

    return allCards.index(indexes).moveItems({
      type: LocationType.AgentDiscard
    })
  }

  exileMultipleCards() {
    if (!this.effect.quantities) return []
    const team = this.effect.opponent ? this.opponentTeam : this.playerHelper.team
    const allCards = this.material(MaterialType.AgentCard)
      .location(LocationType.Influence)
      .locationId(this.effect.influence)
      .player(team)
      .sort((item) => -item.location.x!)

    const moves: MaterialMove[] = []

    for (const quantity of this.effect.quantities) {
      if (allCards.length < quantity) continue
      moves.push(allCards.limit(quantity).moveItemsAtOnce({ type: LocationType.AgentDiscard }))
    }

    return moves
  }
}
