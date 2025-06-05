import { isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { TakeBonusEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'

export class TakeBonusRule extends EffectRule<TakeBonusEffect> {
  getPlayerMoves() {
    return this.bonusTokens.moveItems({
      type: LocationType.PlayerBonus,
      player: this.playerHelper.team
    })
  }

  get bonusTokens() {
    if (this.effect.visible) {
      return this.visibleBonusToken
    }

    return this.reserveBonusToken
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.BonusToken)(move) || move.location.type !== LocationType.PlayerBonus) return []

    // TODO: add effect
    return []
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
