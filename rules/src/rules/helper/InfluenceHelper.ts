import { MaterialGame, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { credits } from '../../material/Credit'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'

export class InfluenceHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly playerId: PlayerId
  ) {
    super(game)
  }

  getCost(item: MaterialItem<PlayerId, LocationType, Agent | undefined>) {
    const description = Agents[item.id!]
    return Math.max(0, description.cost - this.getInfluence(description.influence).length)
  }

  getInfluence(influence: Influence) {
    return this.material(MaterialType.AgentCard).location(LocationType.Influence).locationId(influence).player(this.playerId)
  }

  get creditMoney() {
    return this.material(MaterialType.CreditToken).money(credits)
  }
}
