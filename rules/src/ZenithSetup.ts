import { MaterialDeck, MaterialGameSetup } from '@gamepark/rules-api'
import { times, shuffle, sample } from 'es-toolkit/compat'
import { agents } from './material/Agent'
import { allBonuses } from './material/Bonus'
import { Credit } from './material/Credit'
import { factions } from './material/Faction'
import { Influence, influences } from './material/Influence'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { Memory } from './rules/Memory'
import { RuleId } from './rules/RuleId'
import { TeamColor, teamColors } from './TeamColor'
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
    this.setupTeams()
    this.setupInfluenceDisc()
    this.setupBonuses()
  }

  setupBonuses() {
    const shuffledBonuses = shuffle(allBonuses)
    for (const influence of influences) {
      const bonus = shuffledBonuses.shift()!
      this.material(MaterialType.BonusToken).createItem({
        id: bonus,
        location: {
          type: LocationType.PlanetBoardBonusSpace,
          id: influence
        }
      })
    }

    const technologyBoards = this.material(MaterialType.TechnologyBoard).getIndexes()
    for (const technologyBoardIndex of technologyBoards) {
      this.material(MaterialType.BonusToken).createItem({
        id: shuffledBonuses.shift()!,
        location: {
          type: LocationType.TechnologyBoardBonusSpace,
          parent: technologyBoardIndex,
          x: 2
        }
      })
    }

    for (const bonus of shuffledBonuses) {
      this.material(MaterialType.BonusToken).createItem({
        id: bonus,
        location: {
          type: LocationType.BonusTokenStock
        }
      })
    }
  }

  setupInfluenceDisc() {
    for (const influence of influences) {
      times(3, () => {
        this.material(MaterialType.InfluenceDisc).createItem({
          id: influence,
          location: {
            type: LocationType.InfluenceDiscStock,
            id: influence
          }
        })
      })
    }
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
      this.material(MaterialType.TechnologyBoard).createItem({ id: current, location: { type: LocationType.TechnologyBoardPlace, id: factions[i] } })

      for (const color of teamColors) {
        this.material(MaterialType.TechMarker).createItem({
          id: color,
          location: {
            type: LocationType.TechnologyBoardTokenSpace,
            parent: this.material(MaterialType.TechnologyBoard).id(current).getIndex(),
            player: color,
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

  setupTeams() {
    this.setupTeam(TeamColor.White)
    this.setupTeam(TeamColor.Black)
  }

  setupTeam(team: TeamColor) {
    this.material(MaterialType.CreditToken).createItem({
      id: Credit.Credit1,
      location: {
        type: LocationType.TeamCredit,
        player: team
      },
      quantity: 4
    })

    this.material(MaterialType.CreditToken).createItem({
      id: Credit.Credit3,
      location: {
        type: LocationType.TeamCredit,
        player: team
      }
    })

    this.material(MaterialType.CreditToken).createItem({
      id: Credit.Credit5,
      location: {
        type: LocationType.TeamCredit,
        player: team
      }
    })

    this.material(MaterialType.ZenithiumToken).createItem({
      location: {
        type: LocationType.TeamZenithium,
        player: team
      }
    })
  }

  start() {
    this.memorize(Memory.TurnOrder, shuffle(this.game.players))

    if (this.game.players.length === 4) {
      // Random team starts first
      const startingTeam = sample(teamColors)!
      this.memorize(Memory.CurrentTeam, startingTeam)
    }

    this.startSimultaneousRule(RuleId.Muligan)
  }
}
