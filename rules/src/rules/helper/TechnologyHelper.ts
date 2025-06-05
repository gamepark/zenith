import { MoveItem, PlayerTurnRule } from '@gamepark/rules-api'
import { Effect } from '../../material/effect/Effect'
import { MaterialType } from '../../material/MaterialType'
import { getTechnologyAction } from '../discard-action/TechnologyActions'
import { Memory } from '../Memory'

export class TechnologyHelper extends PlayerTurnRule {
  applyTechnology(move: MoveItem) {
    const board = this.material(MaterialType.TechnologyBoard).getItem<string>(move.location.parent!)
    const actions = getTechnologyAction(board.id)
    this.memorize(Memory.Effects, (effects: Effect[] = []) => {
      const newEffects: Effect[] = JSON.parse(JSON.stringify(actions.slice(0, move.location.x).reverse().flat()))
      effects.push(...newEffects)
      return effects
    })
  }
}
