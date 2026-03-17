import { MaterialDeck, MaterialGameSetup } from '@gamepark/rules-api'
import { shuffle, sample } from 'es-toolkit/compat'
import { Agent, agents } from './material/Agent'
import { allBonuses } from './material/Bonus'
import { Credit } from './material/Credit'
import { factions } from './material/Faction'
import { Influence, influences } from './material/Influence'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { Memory } from './rules/Memory'
import { RuleId } from './rules/RuleId'
import { PlayerHelper } from './rules/helper/PlayerHelper'
import { TeamColor, teamColors } from './TeamColor'
import { ZenithOptions } from './ZenithOptions'
import { ZenithRules } from './ZenithRules'

/**
 * This class creates a new Game based on the game options
 */
export class ZenithSetup extends MaterialGameSetup<PlayerId, MaterialType, LocationType, ZenithOptions> {
  Rules = ZenithRules

  setupMaterial(options: ZenithOptions) {
    this.assignTeams(options)
    this.setupTurnOrder()
    this.setupDeck()
    this.setupPlayers()
    this.setupInfluences()
    this.setupLeaderBadge()
    this.setupTechnologyBoard(options)
    this.setupTeams()
    this.setupBonuses()
  }

  assignTeams(options: ZenithOptions) {
    const playerOptions = Array.isArray(options.players) ? options.players : []
    const hasTeamChoices = playerOptions.some(p => p.team !== undefined)
    const playersPerTeam = this.game.players.length / 2

    if (hasTeamChoices) {
      const whitePlayers = this.game.players.filter((_, i) => playerOptions[i]?.team === TeamColor.White)
      const blackPlayers = this.game.players.filter((_, i) => playerOptions[i]?.team === TeamColor.Black)
      const unassigned = shuffle(this.game.players.filter((_, i) => playerOptions[i]?.team === undefined))

      while (whitePlayers.length < playersPerTeam && unassigned.length > 0) whitePlayers.push(unassigned.shift()!)
      while (blackPlayers.length < playersPerTeam && unassigned.length > 0) blackPlayers.push(unassigned.shift()!)

      for (const p of whitePlayers) this.memorize(Memory.Team, TeamColor.White, p)
      for (const p of blackPlayers) this.memorize(Memory.Team, TeamColor.Black, p)
    } else {
      // No team choices — randomize team assignment
      const shuffled = shuffle([...this.game.players])
      for (let i = 0; i < shuffled.length; i++) {
        this.memorize(Memory.Team, i < playersPerTeam ? TeamColor.White : TeamColor.Black, shuffled[i])
      }
    }
  }

  setupTurnOrder() {
    this.memorize(Memory.TurnOrder, shuffle(this.game.players))
    if (this.game.players.length === 4) {
      this.memorize(Memory.CurrentTeam, sample(teamColors)!)
    }
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

  get secondTeam(): TeamColor {
    if (this.game.players.length === 4) {
      const startingTeam = this.game.memory[Memory.CurrentTeam] as TeamColor
      return startingTeam === TeamColor.White ? TeamColor.Black : TeamColor.White
    }
    const turnOrder = this.game.memory[Memory.TurnOrder] as PlayerId[]
    return new PlayerHelper(this.game, turnOrder[1]).team
  }

  getPlanetStartPosition(planet: Influence) {
    const direction = this.secondTeam === TeamColor.White ? 1 : -1
    if (this.game.players.length === 4) {
      if (planet === Influence.Mars || planet === Influence.Venus) return direction
    } else {
      if (planet === Influence.Terra) return direction
    }
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

  setupTechnologyBoard(options?: ZenithOptions) {
    const boards = [
      options?.animodBoard ?? sample(['S', 'D'])!,
      options?.humanBoard ?? sample(['U', 'O'])!,
      options?.robotBoard ?? sample(['N', 'P'])!
    ]
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

  // TODO: REMOVE — debug only
  setupDebugInfluences() {
    const mercury = this.material(MaterialType.InfluenceDisc).id(Influence.Mercury)
    if (mercury.length) {
      const item = mercury.getItem()!
      item.location.x = (item.location.x ?? 0) + 2
    }
  }

  // TODO: REMOVE — debug only
  setupDebugHand() {
    const me: PlayerId = 1
    const augustusIndex = this.material(MaterialType.AgentCard).id(Agent.Augustus).getIndex()
    const handCards = this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(me)
    if (handCards.length > 0) {
      const firstHandIndex = handCards.getIndex()
      const items = this.game.items[MaterialType.AgentCard]!
      const augustusLoc = { ...items[augustusIndex].location }
      items[augustusIndex].location = { ...items[firstHandIndex].location }
      items[firstHandIndex].location = augustusLoc
    }
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
    this.startSimultaneousRule(RuleId.Muligan)
  }
}
