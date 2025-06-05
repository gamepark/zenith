import { MaterialMove } from '@gamepark/rules-api'
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

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())

    return moves
  }

  isPossible() {
    return this.deck.length > 0
  }

  get deck() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
  }
}
