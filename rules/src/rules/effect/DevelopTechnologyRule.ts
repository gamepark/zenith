import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { DevelopTechnologyEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { TechnologyHelper } from '../helper/TechnologyHelper'
import { EffectRule } from './index'

export class DevelopTechnologyRule extends EffectRule<DevelopTechnologyEffect> {
  getPlayerMoves() {
    return this.technologies.moveItems((item) => ({
      ...item.location,
      x: item.location.x! + 1
    }))
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.TechMarker)(move)) return []
    const moves: MaterialMove[] = []
    if (!this.effect.free) {
      const cost = move.location.x! - (this.effect.discount ?? 0)
      if (cost) {
        moves.push(this.playerHelper.zenithiumMaterial.deleteItem(cost))
      }
    }
    new TechnologyHelper(this.game).applyTechnology(move)
    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  get technologies() {
    const zenithium = this.playerHelper.zenithium
    const techBoard = this.material(MaterialType.TechnologyBoard)
      .locationId((id) => id === (this.effect.faction ?? id))
      .getIndexes()
    const tokens = this.technologyTokens.parent((p: number | undefined) => techBoard.includes(p!))
    if (!tokens.length) return tokens
    if (this.effect.free && this.effect.lowest) {
      const lowestX = tokens.minBy((item) => item.location.x!).getItem()!.location.x!
      return tokens.filter((item) => item.location.x === lowestX)
    }

    const discount = this.effect.discount
    if (discount !== undefined) {
      return tokens.filter((item) => item.location.x! + 1 - discount < zenithium)
    }

    return tokens
  }

  isPossible() {
    return this.technologies.length > 0
  }

  get technologyTokens() {
    return this.material(MaterialType.TechMarker)
      .location(LocationType.TechnologyBoardTokenSpace)
      .player(this.playerHelper.team)
      .location((l) => l.x! < 5)
  }
}
