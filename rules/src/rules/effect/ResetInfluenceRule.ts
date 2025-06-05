import { isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { ResetInfluenceEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor } from '../../TeamColor'
import { EffectRule } from './index'

export class ResetInfluenceRule extends EffectRule<ResetInfluenceEffect> {
  getPlayerMoves() {
    const planets = this.planets
    return planets.moveItems((item) => ({
      ...item.location,
      x: 0
    }))
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.InfluenceDisc)(move) || move.location.x === 0) return []
    this.removeFirstEffect()
    return this.afterEffectPlayed()
  }

  isPossible() {
    return this.planets.length > 0
  }

  get planets() {
    return this.material(MaterialType.InfluenceDisc).location(
      (l) => l.type === LocationType.PlanetBoardInfluenceDiscSpace && (this.playerHelper.team === TeamColor.White ? l.x! < 0 : l.x! > 0)
    )
  }
}
