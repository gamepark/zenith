import { isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { DevelopTechnologyEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
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
    this.removeFirstEffect()
    return this.afterEffectPlayed()
  }

  get technologies() {
    const zenithium = this.playerHelper.zenithium
    const techBoard = this.material(MaterialType.TechnologyBoard).locationId(this.effect.faction).getIndexes()
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
