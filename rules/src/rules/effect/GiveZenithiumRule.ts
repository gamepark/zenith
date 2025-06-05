import { MaterialMove } from '@gamepark/rules-api'
import { GiveZenithiumEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerHelper } from '../helper/PlayerHelper'
import { EffectRule } from './index'

export class GiveZenithiumRule extends EffectRule<GiveZenithiumEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves

    moves.push(
      ...this.zenithium.moveItems(
        {
          type: LocationType.TeamZenithium,
          player: new PlayerHelper(this.game, this.opponentTeam).team
        },
        this.effect.quantity
      )
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())

    return moves
  }

  get zenithium() {
    return this.material(MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(this.playerHelper.team)
  }

  isPossible() {
    return this.zenithium.getQuantity() > (this.effect.quantity ?? 1)
  }
}
