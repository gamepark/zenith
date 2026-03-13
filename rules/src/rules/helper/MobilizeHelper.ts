import { MaterialGame, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { DeckHelper } from './DeckHelper'
import { PlayerHelper } from './PlayerHelper'

export class MobilizeHelper extends MaterialRulesPart {
  private playerHelper: PlayerHelper
  private deckHelper: DeckHelper

  constructor(
    game: MaterialGame,
    readonly player: PlayerId
  ) {
    super(game)
    this.playerHelper = new PlayerHelper(game, player)
    this.deckHelper = new DeckHelper(game)
  }

  mobilize(): MaterialMove[] {
    const agent = this.deckHelper.deck.limit(1)

    if (!agent.length || !agent.getItem()?.id) return []
    return agent.moveItems((item) => ({
      type: LocationType.Influence,
      id: Agents[item.id as Agent].influence,
      player: this.playerHelper.team
    }))
  }

  isPossible() {
    return this.deckHelper.deck.length > 0
  }
}
