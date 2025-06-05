import { isMoveItemType, ItemMove, MaterialGame, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { WinInfluenceEffect } from '../../material/effect/Effect'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor } from '../../TeamColor'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class WinInfluenceRule extends EffectRule<WinInfluenceEffect> {
  constructor(game: MaterialGame, effect?: WinInfluenceEffect) {
    super(game, effect)
  }
  onRuleStart() {
    console.log('effects', this.effects)
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
        console.log(this.effect.except, item.id)
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
    this.memorize(Memory.LastPlanetMoved, this.material(MaterialType.InfluenceDisc).getItem<Influence>(move.itemIndex).id)
    const effect = this.effect
    if (effect.pattern) {
      //TODO: Something more difficult here
      return []
    }
    console.log('???')

    this.removeFirstEffect()
    return this.afterEffectPlayed()
  }

  isAlreadyPlayed(influence: Influence) {
    return this.lastPlanetMoved === influence
  }

  get lastPlanetMoved() {
    return this.remind<Influence | undefined>(Memory.LastPlanetMoved)
  }

  setQuantity(quantity: number) {
    this.effect.quantity ??= quantity
  }
}
