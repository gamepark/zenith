import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { credits } from '../../material/Credit'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { getTeamColor, TeamColor } from '../../TeamColor'

export class InfluenceHelper extends MaterialRulesPart {
  team: TeamColor

  constructor(
    game: MaterialGame,
    readonly playerId: PlayerId
  ) {
    super(game)
    this.team = getTeamColor(playerId)
  }

  getCost(item: MaterialItem<PlayerId, LocationType, Agent | undefined>) {
    const description = Agents[item.id!]
    return Math.max(0, description.cost - this.getInfluence(description.influence).length)
  }

  getInfluence(influence: Influence) {
    return this.material(MaterialType.AgentCard).location(LocationType.Influence).locationId(influence).player(this.team)
  }

  get creditMoney() {
    return this.material(MaterialType.CreditToken).money(credits)
  }
}
