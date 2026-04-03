import { isMoveItemType, Material, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { GiveInfluenceEffect } from '../../material/effect/Effect'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor } from '../../TeamColor'
import { BonusHelper } from '../helper/BonusHelper'
import { EndGameHelper } from '../helper/EndGameHelper'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class GiveInfluenceRule extends EffectRule<GiveInfluenceEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    if (this.effect.resetDifferentPlanet) {
      this.forget(Memory.LastPlanetsMoved)
    }
    return []
  }

  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const planets = this.planets
    moves.push(
      ...planets.moveItems((item) => ({
        ...item.location,
        x: this.getPositionAfterPush(item)
      }))
    )

    return moves
  }

  get planets(): Material {
    const planets = this.material(MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace)
    if (this.effect.except) return planets.filter((item) => item.id !== this.effect.except)
    return planets
  }

  isPossible() {
    return this.getPlayerMoves().length > 0
  }

  getPositionAfterPush(item: MaterialItem) {
    const qty = this.effect.quantity ?? 1
    if (this.playerHelper.team === TeamColor.White) {
      return Math.max(-4, item.location.x! - qty)
    }

    return Math.min(4, item.location.x! + qty)
  }

  beforeItemMove(move: MaterialMove) {
    if (!isMoveItemType(MaterialType.InfluenceDisc)(move)) return []
    const planet = this.material(MaterialType.InfluenceDisc).index(move.itemIndex)
    const item = planet.getItem<Influence>()!
    this.memorize(Memory.LastPlanetsMoved, (planets: Influence[] = []) => planets.concat(item.id))
    return []
  }

  afterItemMove(move: MaterialMove) {
    if (!isMoveItemType(MaterialType.InfluenceDisc)(move)) return []

    if (Math.abs(move.location.x!) === 4) {
      const planet = this.material(MaterialType.InfluenceDisc).index(move.itemIndex)
      const helper = new EndGameHelper(this.game)
      const opponentTeam = this.opponentTeam
      const moves: MaterialMove[] = []
      moves.push(
        ...planet.moveItems({
          type: LocationType.TeamPlanets,
          player: opponentTeam
        })
      )

      const planets = this.material(MaterialType.InfluenceDisc).index([...helper.getTeamPlanet(opponentTeam).getIndexes(), planet.getIndex()])
      if (helper.willEnd(opponentTeam, planets)) {
        moves.push(this.endGame())
      } else {
        const item = planet.getItem<Influence>()!
        moves.push(...new BonusHelper(this.game).applyInfluenceBonus(item.id))
      }

      return moves
    }

    this.removeFirstEffect()
    return this.afterEffectPlayed()
  }
}
