import { isMoveItemType, ItemMove, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { WinInfluenceEffect } from '../../material/effect/Effect'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor } from '../../TeamColor'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class WinInfluenceRule extends EffectRule<WinInfluenceEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    if (this.effect.resetDifferentPlanet) {
      this.forget(Memory.LastPlanetsMoved)
    }

    if (this.effect.influence) {
      return this.getPlayerMoves()
    }

    return []
  }

  get planets() {
    const planets = this.material(MaterialType.InfluenceDisc)
      .location(LocationType.PlanetBoardInfluenceDiscSpace)
      .filter<Influence>((item) => {
        if (this.effect.except) return item.id !== this.effect.except
        if (this.effect.differentPlanet) return !this.isAlreadyPlayed(item.id)
        return true
      })

    if (!planets.length) return planets
    if (this.effect.fromCenter) {
      const centeredPlanets = planets.filter((planet) => planet.location.x === 0)
      if (!centeredPlanets.length) return centeredPlanets
      if (this.effect.influence) return centeredPlanets.id(this.effect.influence)
      return centeredPlanets
    } else if (this.effect.opponentSide) {
      const opponentSidePlanets = planets.filter((planet) => (this.playerHelper.team === TeamColor.White ? planet.location.x! < 0 : planet.location.x! > 0))
      if (!opponentSidePlanets.length) return opponentSidePlanets
      if (this.effect.influence) return opponentSidePlanets.id(this.effect.influence)
    } else {
      if (this.effect.influence) {
        return planets.id(this.effect.influence)
      }
    }

    return planets
  }

  getPositionAfterPull(item: MaterialItem, effect: WinInfluenceEffect): number[] {
    if (effect.times) {
      const positions: number[] = []
      for (let i = 1; i <= effect.times; i++) {
        const newPosition = item.location.x! + i
        if (this.player === TeamColor.Black && newPosition > 4) break
        if (this.player === TeamColor.White && newPosition < -4) break
        positions.push(newPosition)
      }

      return positions
    }

    const quantity = effect.quantity ?? 1
    if (this.player === TeamColor.Black) {
      return [Math.min(4, item.location.x! + quantity)]
    }

    return [Math.max(-4, item.location.x! - quantity)]
  }

  getPlayerMoves(): MaterialMove[] {
    const effect = this.effect
    const planets = this.planets
    console.log(planets, this.effect)
    const moves: MaterialMove[] = []
    for (const index of planets.getIndexes()) {
      const item = planets.getItem(index)
      const positions = this.getPositionAfterPull(item, effect)
      moves.push(
        ...positions.map((x) =>
          planets.index(index).moveItem({
            ...item.location,
            x: x
          })
        )
      )
    }

    return moves
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.InfluenceDisc)(move) || move.location.type !== LocationType.PlanetBoardInfluenceDiscSpace) return []
    const planet = this.material(MaterialType.InfluenceDisc).index(move.itemIndex)
    const item = planet.getItem<Influence>()!
    this.memorize(Memory.LastPlanetsMoved, (planets: Influence[] = []) => planets.concat(item.id))
    const moves: MaterialMove[] = []
    const effect = this.effect

    if (Math.abs(move.location.x!) === 4) {
      moves.push(
        ...planet.moveItems({
          type: LocationType.TeamPlanets,
          player: this.playerHelper.team
        })
      )
    }

    // TODO: Check if it possible to be soft locked (no planet to move ?)
    if (effect.times) {
      effect.times -= move.location.x! - item.location.x!
      if (effect.times > 0) return moves
    } else if (effect.pattern) {
      //TODO: Something more difficult here
    }

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  isAlreadyPlayed(influence: Influence) {
    return this.lastPlanetsMoved?.includes(influence)
  }

  isPossible() {
    return this.planets.length > 0
  }

  get lastPlanetsMoved() {
    return this.remind<Influence[] | undefined>(Memory.LastPlanetsMoved)
  }

  setExtraData(_extraData: Record<string, unknown>) {
    if (_extraData.quantity) {
      this.effect.quantity ??= _extraData.quantity as number
    }

    if (_extraData.factor) {
      this.effect.times = _extraData.factor as number
    }

    if (_extraData.influence) {
      this.effect.influence ??= _extraData.influence as Influence
    }
  }
}
