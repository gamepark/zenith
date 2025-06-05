import { MaterialMove } from '@gamepark/rules-api'
import { TakeLeaderBadgeEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class TakeLeaderBadgeRule extends EffectRule<TakeLeaderBadgeEffect> {
  onRuleStart(): MaterialMove[] {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves

    const leaderBadge = this.leader
    const item = leaderBadge.getItem()!
    const team = this.playerHelper.team
    if (item.location.player === team) {
      if (!item.location.rotation) {
        moves.push(leaderBadge.rotateItem(true))
      }
    } else {
      moves.push(
        ...leaderBadge.moveItems({
          type: LocationType.TeamLeaderBadge,
          rotation: this.effect.gold,
          player: team
        })
      )
    }

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  get leader() {
    return this.material(MaterialType.LeaderBadgeToken)
  }
}
