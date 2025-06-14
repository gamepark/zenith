import { Material, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Bonus } from '../../material/Bonus'
import { Bonuses } from '../../material/Bonuses'
import { Effect } from '../../material/effect/Effect'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../Memory'

export type TechnologyBonusResult = {
  effect: Effect
  moves: MaterialMove[]
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
      ]
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

      this.memorize(Memory.Effects, (e: Effect[]) => {
        const [first, ...other] = e
        return [first, bonusEffect, ...other]
      })
    }

    return moves
  }

  getBonusEffect(bonusToken: Material) {
    if (bonusToken.length) {
      const bonusItem = bonusToken.getItem<Bonus>()!
      const bonusId = bonusItem.id
      return Bonuses[bonusId].effect
    }
    return
  }
}
