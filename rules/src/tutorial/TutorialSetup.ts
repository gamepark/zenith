import { Agent, agents } from '../material/Agent'
import { Bonus } from '../material/Bonus'
import { Credit } from '../material/Credit'
import { Influence, influences } from '../material/Influence'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { Memory } from '../rules/Memory'
import { RuleId } from '../rules/RuleId'
import { TeamColor } from '../TeamColor'
import { ZenithSetup } from '../ZenithSetup'

export const me: PlayerId = 1
export const opponent: PlayerId = 2

/** Player 1 hand */
const player1Hand = [Agent.Mc4ffr3y, Agent.Elisabeth, Agent.Titus, Agent.Huxl3y]

/** Player 2 hand */
const player2Hand = [Agent.Bruss0l0, Agent.Pkd1ck, Agent.LordCreep, Agent.DonaldSmooth]

const handsAgents = new Set([...player1Hand, ...player2Hand])

/**
 * Deterministic tutorial setup for a 2-player game.
 * Overrides ZenithSetup to place specific cards in hands and deck,
 * set Terra at x=-1, and skip mulligan.
 */
export class TutorialSetup extends ZenithSetup {

  setupMaterial() {
    this.setupTeamMemory()
    this.setupTurnOrder()
    this.setupPlayerHands()
    this.setupRemainingDeck()
    this.setupInfluences()
    this.setupLeaderBadge()
    this.setupTechnologyBoard({ animodBoard: 'S', humanBoard: 'U', robotBoard: 'N', players: [] })
    this.setupTeams()
    this.setupBonuses()
  }

  setupTurnOrder() {
    this.memorize(Memory.TurnOrder, [me, opponent])
  }

  setupPlayerHands() {
    for (const agent of player1Hand) {
      this.material(MaterialType.AgentCard).createItem({
        id: agent,
        location: { type: LocationType.PlayerHand, player: me }
      })
    }
    for (const agent of player2Hand) {
      this.material(MaterialType.AgentCard).createItem({
        id: agent,
        location: { type: LocationType.PlayerHand, player: opponent }
      })
    }
  }

  setupRemainingDeck() {
    const remaining = agents.filter(a => !handsAgents.has(a))
    for (const agent of remaining) {
      this.material(MaterialType.AgentCard).createItem({
        id: agent,
        location: { type: LocationType.AgentDeck }
      })
    }
  }

  /** Override to no-op — hands are set in setupPlayerHands */
  setupPlayers() {}

  setupInfluences() {
    for (const planet of influences) {
      this.material(MaterialType.InfluenceDisc).createItem({
        id: planet,
        location: {
          type: LocationType.PlanetBoardInfluenceDiscSpace,
          id: planet,
          x: planet === Influence.Terra ? -1 : 0
        }
      })
    }
  }

  setupBonuses() {
    const planetBonuses = [
      Bonus.WinInfluence,
      Bonus.Win3Credits,
      Bonus.Win4Credits,
      Bonus.Win1Zenithium,
      Bonus.Mobilize2
    ]
    for (let i = 0; i < influences.length; i++) {
      this.material(MaterialType.BonusToken).createItem({
        id: planetBonuses[i],
        location: {
          type: LocationType.PlanetBoardBonusSpace,
          id: influences[i]
        }
      })
    }

    const technologyBoards = this.material(MaterialType.TechnologyBoard).getIndexes()
    const techBonuses = [Bonus.Transfer, Bonus.TakeLeaderBadge, Bonus.Exile2OpponentCards]
    for (let i = 0; i < technologyBoards.length; i++) {
      this.material(MaterialType.BonusToken).createItem({
        id: techBonuses[i],
        location: {
          type: LocationType.TechnologyBoardBonusSpace,
          parent: technologyBoards[i],
          x: 2
        }
      })
    }

    // Remaining bonuses in stock
    const usedBonuses = [...planetBonuses, ...techBonuses]
    const allBonusList = [
      Bonus.WinInfluence, Bonus.WinInfluence, Bonus.WinInfluence, Bonus.WinInfluence,
      Bonus.Win3Credits, Bonus.Win3Credits,
      Bonus.Win4Credits, Bonus.Win4Credits,
      Bonus.Win1Zenithium, Bonus.Win1Zenithium, Bonus.Win1Zenithium,
      Bonus.Exile2OpponentCards,
      Bonus.Mobilize2,
      Bonus.Transfer,
      Bonus.TakeLeaderBadge, Bonus.TakeLeaderBadge
    ]
    // Remove used bonuses from the full list
    for (const used of usedBonuses) {
      const idx = allBonusList.indexOf(used)
      if (idx !== -1) allBonusList.splice(idx, 1)
    }
    for (const bonus of allBonusList) {
      this.material(MaterialType.BonusToken).createItem({
        id: bonus,
        location: { type: LocationType.BonusTokenStock }
      })
    }
  }

  setupTeams() {
    this.setupTeam(TeamColor.White)
    this.setupTeam(TeamColor.Black)
  }

  setupTeam(team: TeamColor) {
    this.material(MaterialType.CreditToken).createItem({
      id: Credit.Credit1,
      location: { type: LocationType.TeamCredit, player: team },
      quantity: 4
    })
    this.material(MaterialType.CreditToken).createItem({
      id: Credit.Credit3,
      location: { type: LocationType.TeamCredit, player: team }
    })
    this.material(MaterialType.CreditToken).createItem({
      id: Credit.Credit5,
      location: { type: LocationType.TeamCredit, player: team }
    })
    this.material(MaterialType.ZenithiumToken).createItem({
      location: { type: LocationType.TeamZenithium, player: team }
    })
  }

  setupTeamMemory() {
    this.memorize(Memory.Team, TeamColor.White, me)
    this.memorize(Memory.Team, TeamColor.Black, opponent)
  }

  start() {
    this.startPlayerTurn(RuleId.PlayCard, me)
  }
}
