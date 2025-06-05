import { isMoveItemType, MaterialMove } from '@gamepark/rules-api'
import { GiveLeaderBadgeEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class GiveLeaderBadgeRule extends EffectRule<GiveLeaderBadgeEffect> {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    moves.push(
      this.leaderBadge.moveItem({
        type: LocationType.TeamLeaderBadge,
        player: this.opponentTeam
      })
    )
    return moves
  }

  get leaderBadge() {
    return this.material(MaterialType.LeaderBadgeToken)
  }

  isPossible() {
    return this.playerHelper.isLeader
  }

  afterItemMove(move: MaterialMove) {
    if (!isMoveItemType(MaterialType.InfluenceDisc)(move)) return []
    this.removeFirstEffect()
    return this.afterEffectPlayed()
  }
}
