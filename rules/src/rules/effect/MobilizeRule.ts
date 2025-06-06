import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { MobilizeEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class MobilizeRule extends EffectRule<MobilizeEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    return this.getAutomaticEffectMoves()
  }

  getAutomaticEffectMoves(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const agent = this.material(MaterialType.AgentCard)
      .location(LocationType.AgentDeck)
      .deck()
      .limit(this.effect.quantity ?? 1)

    if (!agent.length || !agent.getItem()?.id) return []
    moves.push(
      ...agent.moveItems((item) => ({
        type: LocationType.Influence,
        id: Agents[item.id as Agent].influence,
        player: this.playerHelper.team
      }))
    )

    return moves
  }

  decrement(move: ItemMove): boolean {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.Influence) return false

    if (this.effect.quantity) {
      this.effect.quantity--
      return this.effect.quantity === 0
    }

    return true
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.Influence) return []

    if (this.effect.quantity) {
      this.effect.quantity--
    }

    if (!this.effect.quantity) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return []
  }

  getExtraDataFromMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
      const card = this.material(MaterialType.AgentCard).getItem<Agent>(move.itemIndex)
      return { quantity: Agents[card.id].cost, influence: Agents[card.id].influence }
    }

    return {}
  }

  isPossible() {
    return this.deck.length > 0
  }

  get deck() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
  }
}
