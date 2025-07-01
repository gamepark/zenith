import { Material, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Bonus } from '../../material/Bonus'
import { Bonuses } from '../../material/Bonuses'
import { Effect, ExpandedEffect } from '../../material/effect/Effect'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../Memory'

export type TechnologyBonusResult = {
  effect: Effect
  moves: MaterialMove[]
  bonusId: Bonus
}

export class BonusHelper extends MaterialRulesPart {
  applyInfluenceBonus(influence: Influence): MaterialMove[] {
    const bonusToken = this.material(MaterialType.BonusToken).location(LocationType.PlanetBoardBonusSpace).locationId(influence)
    return this.applyBonusEffect(bonusToken)
  }

  getTechnologyBonus(token: Material): TechnologyBonusResult | undefined {
    const tokenItem = token.getItem()!
    if (tokenItem.location.x !== 2) return
    const bonusToken = this.material(MaterialType.BonusToken).location(LocationType.TechnologyBoardBonusSpace).parent(tokenItem.location.parent)
    if (!bonusToken.length) return
    return {
      effect: this.getBonusEffect(bonusToken)!,
      moves: [
        bonusToken.moveItem({
          type: LocationType.BonusDiscard
        })
      ],
      bonusId: bonusToken.getItem()!.id
    }
  }

  applyBonusEffect(bonusToken: Material): MaterialMove[] {
    const moves: MaterialMove[] = []
    const bonusEffect = this.getBonusEffect(bonusToken)
    if (bonusEffect) {
      moves.push(
        bonusToken.moveItem({
          type: LocationType.BonusDiscard
        })
      )

      const effects = this.remind<ExpandedEffect[]>(Memory.Effects)
      effects.splice(1, 0, {
        ...bonusEffect,
        effectSource: {
          type: MaterialType.BonusToken,
          value: bonusToken.getItem()!.id
        }
      })
    }

    return moves
  }

  getBonusEffect(bonusToken: Material) {
    if (bonusToken.length) {
      const bonusItem = bonusToken.getItem<Bonus>()!
      const bonusId = bonusItem.id
      return JSON.parse(JSON.stringify(Bonuses[bonusId].effect)) as Effect
    }
    return
  }
}
