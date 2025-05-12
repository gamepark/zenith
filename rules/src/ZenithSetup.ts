import { MaterialDeck, MaterialGameSetup } from '@gamepark/rules-api'
import shuffle from 'lodash/shuffle'
import { agents } from './material/Agent'
import { influences } from './material/Influence'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { RuleId } from './rules/RuleId'
import { ZenithOptions } from './ZenithOptions'
import { ZenithRules } from './ZenithRules'

/**
 * This class creates a new Game based on the game options
 */
export class ZenithSetup extends MaterialGameSetup<PlayerId, MaterialType, LocationType, ZenithOptions> {
  Rules = ZenithRules

  setupMaterial(_options: ZenithOptions) {
    this.setupDeck()
    this.setupPlayers()
    this.setupInfluences()
  }

  setupInfluences() {
    const planets = influences
    for (const planet of planets) {
      this.material(MaterialType.InfluenceDisc).createItem({
        id: planet,
        location: {
          type: LocationType.PlanetBoardInfluenceDiscSpace,
          id: planet
        }
      })
    }
  }

  setupDeck() {
    const shuffledAgents = shuffle(agents)
    this.material(MaterialType.AgentCard).createItems(
      shuffledAgents.map((agent) => ({
        id: agent,
        location: {
          type: LocationType.AgentDeck
        }
      }))
    )
  }

  setupPlayers() {
    const deck = this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
    for (const player of this.game.players) {
      this.setupPlayer(deck, player)
    }
  }

  setupPlayer(deck: MaterialDeck, player: PlayerId) {
    deck.deal(
      {
        type: LocationType.PlayerHand,
        player
      },
      4
    )
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
