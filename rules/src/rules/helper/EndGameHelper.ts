import { Material, MaterialRulesPart } from '@gamepark/rules-api'
import { uniqBy, maxBy } from 'es-toolkit/compat'
import { Influence, influences } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor, teamColors } from '../../TeamColor'

export class EndGameHelper extends MaterialRulesPart {
  willEnd(team: TeamColor, planets = this.getTeamPlanet(team)) {
    if (planets.length === 5) return true
    const maxSameInfluence = this.getMaxSameInfluence(planets)
    if (maxSameInfluence && maxSameInfluence.count >= 3) return true
    if (this.getCountDifferentInfluence(planets) >= 4) return true
    return false
  }

  get winningTeam() {
    return teamColors.find((team) => this.willEnd(team))
  }

  getTeamPlanet(team: TeamColor) {
    return this.material(MaterialType.InfluenceDisc).location(LocationType.TeamPlanets).player(team)
  }

  getCountDifferentInfluence(planets: Material) {
    return uniqBy(planets.getItems(), (item) => item.id).length
  }

  getMaxSameInfluence(planets: Material): { influence: Influence; count: number } | undefined {
    const maxInfluence = maxBy(influences, (i) => planets.id(i).length)
    if (!maxInfluence) return
    return {
      influence: maxInfluence,
      count: planets.id(maxInfluence).length
    }
  }
}
