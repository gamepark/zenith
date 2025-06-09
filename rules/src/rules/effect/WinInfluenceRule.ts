import { isMoveItemType, ItemMove, Material, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { WinInfluenceEffect } from '../../material/effect/Effect'
import { Influence, influences } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor } from '../../TeamColor'
import { EndGameHelper } from '../helper/EndGameHelper'
import { Memory, PatternType } from '../Memory'
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
      return this.fromCenterPlanets(planets)
    } else if (this.effect.opponentSide) {
      return this.opponentSidePlanets(planets)
    } else if (this.effect.influence) {
      return this.influencePlanet(planets)
    }

    return planets
  }

  private patternPlanet(): MaterialMove[] {
    const pattern = this.effect.pattern
    const planets = this.planets
    const movedPlanets = this.remind<PatternType[] | undefined>(Memory.Pattern) ?? []
    if (!pattern) return []
    const moves: MaterialMove[] = []

    const possiblePatterns: PatternType[][] = this.computePossiblePatterns().filter((patternType) => {
      if (!movedPlanets.length) return true
      return movedPlanets.every((m) => patternType.some((p) => p.influence === m.influence && p.count === m.count))
    })

    for (const planetIndex of planets.getIndexes()) {
      const material = planets.index(planetIndex)
      const item = planets.getItem<Influence>(planetIndex)
      if (movedPlanets.some((patternType) => patternType.influence === item.id)) continue
      const planetPossiblePatterns = possiblePatterns
        .filter((patternType) => patternType.some((p) => p.influence === item.id))
        .map((patternType) => patternType.find((p) => p.influence === item.id)!)

      moves.push(
        ...planetPossiblePatterns.map((type) =>
          material.moveItem({
            ...item.location,
            x: this.getPositionForQuantity(item, type.count)
          })
        )
      )
    }

    return moves
  }

  computePossiblePatterns() {
    const pattern = this.effect.pattern
    if (!pattern) return []
    const patterns: PatternType[][] = []
    for (let i = 1; i <= influences.length - (pattern.length - 1); i++) {
      const patternInfluences = influences.slice(i - 1, i + pattern.length - 1)
      patterns.push(patternInfluences.map((i, index) => ({ influence: i, count: pattern[index] })))
    }

    return patterns
  }

  private influencePlanet(planets: Material) {
    return planets.id(this.effect.influence)
  }

  private opponentSidePlanets(planets: Material) {
    const opponentSidePlanets = planets.filter((planet) => (this.playerHelper.team === TeamColor.White ? planet.location.x! < 0 : planet.location.x! > 0))
    if (!opponentSidePlanets.length) return opponentSidePlanets
    if (this.effect.influence) return opponentSidePlanets.id(this.effect.influence)
    return planets
  }

  private fromCenterPlanets(planets: Material) {
    const centeredPlanets = planets.filter((planet) => planet.location.x === 0)
    if (!centeredPlanets.length) return centeredPlanets
    if (this.effect.influence) return centeredPlanets.id(this.effect.influence)
    return centeredPlanets
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

    return [this.getPositionForQuantity(item, effect.quantity ?? 1)]
  }

  private getPositionForQuantity(item: MaterialItem, quantity: number) {
    if (this.player === TeamColor.Black) {
      return Math.min(4, item.location.x! + quantity)
    }

    return Math.max(-4, item.location.x! - quantity)
  }

  getPlayerMoves(): MaterialMove[] {
    const effect = this.effect
    const planets = this.planets
    if (this.effect.pattern) {
      return this.patternPlanet()
    }

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
      const helper = new EndGameHelper(this.game)
      const planets = this.material(MaterialType.InfluenceDisc).index([...helper.getTeamPlanet(this.playerHelper.team).getIndexes(), planet.getIndex()])
      moves.push(
        ...planet.moveItems({
          type: LocationType.TeamPlanets,
          player: this.playerHelper.team
        })
      )
      if (helper.willEnd(this.playerHelper.team, planets)) {
        moves.push(this.endGame())
        return moves
      }
    }

    if (effect.times) {
      effect.times -= move.location.x! - item.location.x!
      if (effect.times > 0) return moves
    } else if (effect.pattern) {
      this.memorize(Memory.Pattern, (patternTypes: PatternType[] = []) =>
        patternTypes.concat({ influence: item.id, count: move.location.x! - item.location.x! })
      )

      const patternMoves = this.patternPlanet()
      if (patternMoves.length >= 1 && patternMoves.length <= 2) return this.patternPlanet().slice(0, 1)
      if (patternMoves.length > 0) return moves
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
