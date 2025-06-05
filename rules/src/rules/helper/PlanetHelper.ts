import { Material, MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { GiveInfluenceEffect, ResetInfluenceEffect, WinInfluenceEffect } from '../../material/effect/Effect'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { TeamColor } from '../../TeamColor'
import { Memory } from '../Memory'
import { PlayerHelper } from './PlayerHelper'

export class PlanetHelper extends MaterialRulesPart {
  private playerHelper: PlayerHelper

  constructor(
    game: MaterialGame,
    readonly player: PlayerId
  ) {
    super(game)
    this.playerHelper = new PlayerHelper(game, player)
  }

  getPushablePlanets(effect: GiveInfluenceEffect): Material {
    const planets = this.planets
    if (effect.except) return planets.filter((item) => item.id !== effect.except)
    return planets
  }

  getPullablePlanets(effect: WinInfluenceEffect): Material {
    const planets = this.planets
    const filteredPlanets = effect.differentPlanet && this.alreadyPlayedPlanets?.length ? planets.id((id: Influence) => !this.isAlreadyPlayed(id)) : planets
    if (!filteredPlanets.length) return filteredPlanets
    if (effect.fromCenter) {
      const centeredPlanets = filteredPlanets.filter((planet) => planet.location.x === 0)
      if (!centeredPlanets.length) return centeredPlanets
      if (effect.influence) return centeredPlanets.id(effect.influence)
    } else if (effect.opponentSide) {
      const opponentSidePlanets = filteredPlanets.filter((planet) =>
        this.playerHelper.team === TeamColor.White ? planet.location.x! < 0 : planet.location.x! > 0
      )
      if (!opponentSidePlanets.length) return opponentSidePlanets
      if (effect.influence) return opponentSidePlanets.id(effect.influence)
    } else {
      if (effect.influence) {
        return planets.id(effect.influence)
      }
    }

    return planets
  }

  getResetablePlanets() {
    return this.planets.filter((planet) => planet.location.x !== 0)
  }

  isPossibleToPull(effect: WinInfluenceEffect) {
    return this.getPullablePlanets(effect).length > 0
  }

  isPossibleToPush(effect: GiveInfluenceEffect) {
    return this.getPushablePlanets(effect).length > 0
  }

  isAlreadyPlayed(influence: Influence) {
    return this.alreadyPlayedPlanets?.includes(influence)
  }

  get alreadyPlayedPlanets() {
    return this.remind<Influence[] | undefined>(Memory.LastPlanetsMoved)
  }

  isPossibleToReset(_effect: ResetInfluenceEffect) {
    return this.getResetablePlanets().length > 0
  }

  get planets() {
    return this.material(MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace)
  }

  getPlanet(influence: Influence) {
    return this.material(MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace).id(influence)
  }
}
