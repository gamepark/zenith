import { MaterialMove } from '@gamepark/rules-api'
import { ExpandedEffect, TakeTechnologyBonusToken } from '../../material/effect/Effect'
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
    this.memorize(Memory.CurrentEffect, JSON.parse(JSON.stringify(this.effect)))
    this.removeFirstEffect()
    if (bonusEffect) {
      this.memorize(Memory.WonBonus, bonusEffect.bonusId)
      this.memorize(Memory.Effects, (effects: ExpandedEffect[] = []) => {
        effects.unshift({
          ...bonusEffect.effect,
          effectSource: {
            type: MaterialType.TechnologyBoard,
            value: this.board.getItem()!.location.id
          }
        })
        return effects
      })

      moves.push(...bonusEffect.moves)
    }

    moves.push(...this.afterEffectPlayed())
    return moves
  }

  get bonusEffect(): TechnologyBonusResult | undefined {
    const effect = this.effect
    const board = this.board
    const token = this.material(MaterialType.TechMarker)
      .location(LocationType.TechnologyBoardTokenSpace)
      .parent(board.getIndex())
      .player(this.playerHelper.team)
    const item = token.getItem()!
    if (item.location.x !== effect.x) return undefined
    return new BonusHelper(this.game).getTechnologyBonus(token)
  }

  get board() {
    const effect = this.effect
    return this.material(MaterialType.TechnologyBoard).locationId(effect.faction)
  }

  isPossible(): boolean {
    return this.bonusEffect !== undefined
  }

  onRuleEnd() {
    this.forget(Memory.WonBonus)
    this.forget(Memory.CurrentEffect)
    return []
  }
}
