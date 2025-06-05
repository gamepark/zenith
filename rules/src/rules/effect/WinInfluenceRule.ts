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
    if (this.effect.influence) {
      const planets = this.planets
      moves.push(
        ...planets.moveItems((item) => ({
          ...item.location,
          x: this.getPositionAfterPull(item, this.effect)
        }))
      )
      return moves
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

  getPositionAfterPull(item: MaterialItem, effect: WinInfluenceEffect) {
    if (this.player === TeamColor.Black) {
      return Math.min(4, item.location.x! + (effect.quantity ?? 1))
    }

    return Math.max(-4, item.location.x! - (effect.quantity ?? 1))
  }

  getPlayerMoves(): MaterialMove[] {
    const effect = this.effect
    const planets = this.planets
    return planets.moveItems((item) => ({
      ...item.location,
      x: this.getPositionAfterPull(item, effect)
    }))
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.InfluenceDisc)(move)) return []
    this.memorize(Memory.LastPlanetsMoved, (planets: Influence[] = []) =>
      planets.concat(this.material(MaterialType.InfluenceDisc).getItem<Influence>(move.itemIndex).id)
    )
    const effect = this.effect
    if (effect.pattern) {
      //TODO: Something more difficult here
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    this.removeFirstEffect()
    return this.afterEffectPlayed()
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.InfluenceDisc)(move)) return []
    const planet = this.material(MaterialType.InfluenceDisc).index(move.itemIndex)
    const item = planet.getItem()!
    if (Math.abs(item.location.x!) === 4) {
      return planet.moveItems({
        type: LocationType.TeamPlanets,
        player: this.playerHelper.team
      })
    }

    return []
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

    if (_extraData.influence) {
      this.effect.influence ??= _extraData.influence as Influence
    }
  }
}
