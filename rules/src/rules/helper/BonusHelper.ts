import { MaterialRulesPart } from '@gamepark/rules-api'
import { TakeBonusEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class BonusHelper extends MaterialRulesPart {
  getBonusTokens(effect: TakeBonusEffect) {
    if (effect.visible) {
      return this.visibleBonusToken
    }

    return this.reserveBonusToken
  }

  isPossible(effect: TakeBonusEffect) {
    return this.getBonusTokens(effect).length > 0
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
