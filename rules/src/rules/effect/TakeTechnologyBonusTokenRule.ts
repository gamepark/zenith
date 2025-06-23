import { MaterialMove } from '@gamepark/rules-api'
import { Effect, TakeTechnologyBonusToken } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { BonusHelper, TechnologyBonusResult } from '../helper/BonusHelper'
import { Memory } from '../Memory'
import { EffectRule } from './EffectRule'

export class TakeTechnologyBonusTokenRule extends EffectRule<TakeTechnologyBonusToken> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves

    const bonusEffect = this.bonusEffect
    this.removeFirstEffect()
    if (bonusEffect) {
      this.memorize(Memory.Effects, (effects: Effect[] = []) => {
        effects.unshift(bonusEffect.effect)
        return effects
      })

      moves.push(...bonusEffect.moves)
    }

    moves.push(...this.afterEffectPlayed())
    return moves
  }

  get bonusEffect(): TechnologyBonusResult | undefined {
    const effect = this.effect
    const board = this.material(MaterialType.TechnologyBoard).locationId(effect.faction)
    const token = this.material(MaterialType.TechMarker).location(LocationType.TechnologyBoardTokenSpace).parent(board.getIndex())
    const item = token.getItem()!
    if (item.location.x !== effect.x) return undefined
    return new BonusHelper(this.game).getTechnologyBonus(token)
  }

  isPossible(): boolean {
    return this.bonusEffect !== undefined
  }
}
