import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { TakeBonusEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { BonusHelper } from '../helper/BonusHelper'
import { EffectRule } from './index'

export class TakeBonusRule extends EffectRule<TakeBonusEffect> {
  getPlayerMoves() {
    return this.bonusTokens.moveItems({
      type: LocationType.BonusDiscard
    })
  }

  get bonusTokens() {
    if (this.effect.visible) {
      return this.visibleBonusToken
    }

    return this.reserveBonusToken
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.BonusToken)(move) || move.location.type !== LocationType.BonusDiscard) return []
    const bonusToken = this.material(MaterialType.BonusToken).index(move.itemIndex)
    const moves: MaterialMove[] = []
    // Ignore move since token is already discard
    new BonusHelper(this.game).applyBonusEffect(bonusToken)
    this.removeFirstEffect()
    moves.push(...this.applyFirstEffect())
    return moves
  }

  isPossible() {
    return this.bonusTokens.length > 0
  }

  get visibleBonusToken() {
    return this.material(MaterialType.BonusToken).location(
      (l) => l.type === LocationType.PlanetBoardBonusSpace || l.type === LocationType.TechnologyBoardBonusSpace
    )
  }

  get reserveBonusToken() {
    return this.material(MaterialType.BonusToken).location(LocationType.BonusTokenStock)
  }
}
