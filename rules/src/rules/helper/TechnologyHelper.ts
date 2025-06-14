import { MaterialMove, MoveItem, PlayerTurnRule } from '@gamepark/rules-api'
import { Effect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { getTechnologyAction, TechnologyLineBonuses } from '../discard-action/TechnologyActions'
import { Memory } from '../Memory'
import { BonusHelper, TechnologyBonusResult } from './BonusHelper'

export class TechnologyHelper extends PlayerTurnRule {
  applyTechnology(move: MoveItem): MaterialMove[] {
    const board = this.material(MaterialType.TechnologyBoard).getItem<string>(move.location.parent!)
    const token = this.material(MaterialType.TechMarker).index(move.itemIndex)
    const actions = getTechnologyAction(board.id)

    const bonusEffect: TechnologyBonusResult | undefined = new BonusHelper(this.game).getTechnologyBonus(token)
    this.memorize(Memory.Effects, (effects: Effect[] = []) => {
      const newEffects: Effect[][] = JSON.parse(JSON.stringify(actions.slice(0, move.location.x).reverse()))
      if (bonusEffect) {
        const [first, ...other] = newEffects
        effects.push(...first.flat(), bonusEffect.effect, ...other.flat())
        return effects
      }

      effects.push(...newEffects.flat())
      return effects
    })

    const hasLine =
      this.material(MaterialType.TechMarker)
        .location(LocationType.TechnologyBoardTokenSpace)
        .player(move.location.player)
        .filter((item) => item.location.x! >= move.location.x!).length === 3

    if (hasLine && TechnologyLineBonuses[move.location.x! - 1]) {
      this.memorize(Memory.Effects, (effects: Effect[] = []) => {
        const effect: Effect = JSON.parse(JSON.stringify(TechnologyLineBonuses[move.location.x! - 1]))
        effects.push(effect)
        return effects
      })
    }

    if (bonusEffect) {
      return bonusEffect.moves
    }

    return []
  }
}
