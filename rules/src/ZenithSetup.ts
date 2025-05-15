import { MaterialDeck, MaterialGameSetup } from '@gamepark/rules-api'
import shuffle from 'lodash/shuffle'
import { teamColors } from './TeamColor'
import { agents } from './material/Agent'
import { Influence, influences } from './material/Influence'
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
    this.setupLeaderBadge()
    this.setupTechnologyBoard()
  }

  setupLeaderBadge() {
    this.material(MaterialType.LeaderBadgeToken).createItem({
      location: {
        type: LocationType.DiplomacyBoardLeaderBadgeSpace
      }
    })
  }

  setupInfluences() {
    for (const planet of influences) {
      this.material(MaterialType.InfluenceDisc).createItem({
        id: planet,
        location: {
          type: LocationType.PlanetBoardInfluenceDiscSpace,
          id: planet,
          x: this.getPlanetStartPosition(planet)
        }
      })
    }
  }

  getPlanetStartPosition(planet: Influence) {
    if (planet === Influence.Terra) return -1
    return 0
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

  setupTechnologyBoard() {
    const boards = ['S', 'U', 'N']
    for (let i = 0; i < boards.length; i++) {
      const current = boards[i]
      this.material(MaterialType.TechnologyBoard).createItem({ id: current, location: { type: LocationType.TechnologyBoardPlace, id: boards.length - i } })

      for (const color of teamColors) {
        console.log(this.material(MaterialType.TechnologyBoard).id(current).getIndex())
        this.material(MaterialType.TechMarker).createItem({
          id: color,
          location: {
            type: LocationType.TechnologyBoardTokenSpace,
            parent: this.material(MaterialType.TechnologyBoard).id(current).getIndex(),
            id: color,
            x: 0
          }
        })
      }
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
    this.startSimultaneousRule(RuleId.Muligan)
  }
}
