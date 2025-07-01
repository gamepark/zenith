import { MaterialMove, MoveItem, PlayerTurnRule } from '@gamepark/rules-api'
import { Effect, ExpandedEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { getTechnologyAction, TechnologyLineBonuses } from '../discard-action/TechnologyActions'
import { Memory } from '../Memory'

export class TechnologyHelper extends PlayerTurnRule {
  applyTechnology(move: MoveItem): MaterialMove[] {
    const board = this.material(MaterialType.TechnologyBoard).getItem<string>(move.location.parent!)
    const actions = getTechnologyAction(board.id)

    this.memorize(Memory.Effects, (effects: ExpandedEffect[] = []) => {
      const newEffects: ExpandedEffect[][] = JSON.parse(JSON.stringify(actions.slice(0, move.location.x).reverse()))
      effects.push(
        ...newEffects.flat().map((e) => ({
          ...e,
          effectSource: {
            type: MaterialType.TechnologyBoard,
            value: board.location.id
          }
        }))
      )
      return effects
    })

    const hasLine =
      this.material(MaterialType.TechMarker)
        .location(LocationType.TechnologyBoardTokenSpace)
        .player(move.location.player)
        .filter((item) => item.location.x! >= move.location.x!).length === 3

    if (hasLine && TechnologyLineBonuses[move.location.x! - 1]) {
      this.memorize(Memory.Effects, (effects: ExpandedEffect[] = []) => {
        const effect: Effect = JSON.parse(JSON.stringify(TechnologyLineBonuses[move.location.x! - 1]))
        effects.push({
          ...effect,
          effectSource: {
            type: MaterialType.TechnologyBoard,
            value: board.location.id
          }
        })
        return effects
      })
    }

    return []
  }
}
