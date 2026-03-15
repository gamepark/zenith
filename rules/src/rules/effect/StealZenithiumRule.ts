import { MaterialMove } from '@gamepark/rules-api'
import { StealZenithiumEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { EffectRule } from './index'

export class StealZenithiumRule extends EffectRule<StealZenithiumEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    moves.push(this.customMove(CustomMoveType.StealZenithiumLog, this.effect.quantity))

    // Move zenithium from opponent to player (same pattern as GiveZenithiumRule but reversed)
    moves.push(
      ...this.material(MaterialType.ZenithiumToken)
        .location(LocationType.TeamZenithium)
        .player(this.opponentTeam)
        .moveItems(
          {
            type: LocationType.TeamZenithium,
            player: this.playerHelper.team
          },
          this.effect.quantity
        )
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  isPossible() {
    return this.material(MaterialType.ZenithiumToken)
      .location(LocationType.TeamZenithium)
      .player(this.opponentTeam)
      .getQuantity() >= this.effect.quantity
  }
}
