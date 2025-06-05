import { MaterialGame, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { PlayerHelper } from './PlayerHelper'

export class MobilizeHelper extends MaterialRulesPart {
  private playerHelper: PlayerHelper

  constructor(
    game: MaterialGame,
    readonly player: PlayerId
  ) {
    super(game)
    this.playerHelper = new PlayerHelper(game, player)
  }

  mobilize(): MaterialMove[] {
    const agent = this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck().limit(1)

    if (!agent.length || !agent.getItem()?.id) return []
    return agent.moveItems((item) => ({
      type: LocationType.Influence,
      id: Agents[item.id as Agent].influence,
      player: this.playerHelper.team
    }))
  }

  isPossible() {
    return this.deck.length > 0
  }

  get deck() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
  }
}
