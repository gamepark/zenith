import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { TeamColor } from '../../TeamColor'

export class InfluenceHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly team: TeamColor
  ) {
    super(game)
  }

  getCost(item: MaterialItem<PlayerId, LocationType, Agent | undefined>) {
    const description = Agents[item.id!]
    return Math.max(0, description.cost - this.getInfluence(description.influence).length)
  }

  getInfluence(influence: Influence) {
    return this.influence.locationId(influence)
  }

  get influence() {
    return this.material(MaterialType.AgentCard).location(LocationType.Influence).player(this.team)
  }
}
