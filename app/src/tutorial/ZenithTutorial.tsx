/** @jsxImportSource @emotion/react */
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, isStartRule, MaterialGame, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { Agent } from '@gamepark/zenith/material/Agent'
import { Faction } from '@gamepark/zenith/material/Faction'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { me, opponent, TutorialSetup } from '@gamepark/zenith/tutorial/TutorialSetup'
import { Trans } from 'react-i18next'

/** Steps where the diplomacy board should be displayed horizontally (no rotation) */
export const DIPLOMACY_BOARD_HORIZONTAL_STEPS = [23, 25]

export class ZenithTutorial extends MaterialTutorial<PlayerId, MaterialType, LocationType> {
  version = 1
  options = { players: [{ id: me }, { id: opponent }] }
  setup = new TutorialSetup()
  players = [
    { id: me },
    { id: opponent, name: 'Rival' }
  ]

  steps: TutorialStep<PlayerId, MaterialType, LocationType>[] = [
    // ===== INTRODUCTION (steps 0–4) =====
    {
      popup: {
        text: () => <Trans i18nKey="tuto.welcome" defaults="Welcome to <bold>Zenith</bold>! Two teams compete for control of 5 planets. Let's learn the basics!" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.planets" defaults="Here are the <bold>5 planets</bold>: Mercury, Venus, Terra, Mars and Jupiter. Each has an influence track that works like a tug of war." components={{ bold: <strong/> }}/>,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace)
        ],
        margin: { top: 10, bottom: 5, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.discs" defaults="These <bold>influence discs</bold> move along the tracks. Push a disc all the way to your side to capture it!" components={{ bold: <strong/> }}/>,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace)
        ],
        margin: { top: 10, bottom: 5, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.victory" defaults='There are <bold>3 ways to win</bold>: capture 3 discs of the same planet (<bold>absolute victory</bold>), 4 discs of different planets (<bold>democratic victory</bold>), or 5 discs total (<bold>popular victory</bold>).' components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.actions" defaults="Each turn, play <bold>1 card</bold> from your hand to perform one of 3 actions: <bold>Recruit</bold> an agent, <bold>Develop</bold> a technology, or take <bold>Leadership</bold>." components={{ bold: <strong/> }}/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me)
        ],
        margin: { top: 10 }
      })
    },

    // ===== TURN 1 P1: Recruit Mc4ffr3y (steps 5–8) =====
    {
      popup: {
        text: () => <Trans i18nKey="tuto.recruit" defaults="Let's start by <bold>recruiting</bold> an agent! Play <bold>Mc4ffr3y</bold> to your influence zone. This costs credits and gives you influence on Mars." components={{ bold: <strong/> }}/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me).id(Agent.Mc4ffr3y)
        ],
        margin: { top: 10 }
      }),
      move: {
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.Influence
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.Mc4ffr3y,
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.Refill
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.recruit.done" defaults="Great! The Mars influence disc has moved toward your side. Recruiting agents is the main way to gain influence on planets." components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace).id(Influence.Mars)
        ],
        margin: { top: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end-turn" defaults="Your turn is over. At the end of each turn, you draw cards back up to your hand limit." />,
        position: { y: -15 }
      },
      move: {}
    },

    // ===== TURN 1 P2: Opponent recruits Bruss0l0 (steps 8–9) =====
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-turn" defaults="It's your opponent's turn to play..." />,
        position: { y: -15 }
      }
    },
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.Influence
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.Bruss0l0
      }
    },

    // ===== TURN 2 P1: Develop Animod tech (steps 10–16) =====
    {
      popup: {
        text: () => <Trans i18nKey="tuto.discover-tech" defaults="Now let's discover the second action: <bold>Develop a technology</bold>. To do this, you must discard a card from your hand." components={{ bold: <strong/> }}/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me)
        ],
        margin: { top: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-boards" defaults="There are <bold>3 technology tracks</bold>, one per faction: Animod, Human, and Robot. Each track has 3 levels with cumulative bonuses." components={{ bold: <strong/> }}/>,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TechnologyBoard)],
        margin: { top: 5, bottom: 3, right: 25 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-how" defaults="To develop a technology, <bold>discard a card</bold> (its faction determines which track), then <bold>pay zenithium</bold> to advance your marker." components={{ bold: <strong/> }}/>,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.TechnologyBoard),
          this.material(game, MaterialType.TechMarker)
        ],
        margin: { top: 5, bottom: 3, right: 25 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-discard" defaults="Discard <bold>Elisabeth</bold> (Animod faction) to develop Animod technology." components={{ bold: <strong/> }}/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me).id(Agent.Elisabeth)
        ],
        locations: [
          this.location(LocationType.AgentCardFaction)
            .parent(this.material(game, MaterialType.AgentCard).id(Agent.Elisabeth))
            .location
        ],
        margin: { top: 10 }
      }),
      move: {
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.AgentDiscard
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.Elisabeth,
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.DiscardAction
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-develop" defaults="Now <bold>develop</bold> the Animod technology by advancing your marker. This costs 1 zenithium for level 1." components={{ bold: <strong/> }}/>,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.TechnologyBoard),
          this.material(game, MaterialType.TechMarker)
        ],
        margin: { top: 5, bottom: 3, right: 25 }
      }),
      move: {}
    },
    {
      move: {
        filter: (move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move)
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-done" defaults="You developed Animod technology level 1! Each level grants bonuses, and all lower levels apply again when you advance." components={{ bold: <strong/> }}/>,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.TechnologyBoard),
          this.material(game, MaterialType.TechMarker)
        ],
        margin: { top: 5, bottom: 3, right: 25 }
      })
    },

    // ===== TURN 2 P2: Opponent develops Human tech (steps 17–20) =====
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-turn" defaults="It's your opponent's turn to play..." />,
        position: { y: -15 }
      }
    },
    // Opponent discards DonaldSmooth
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.AgentDiscard
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.DonaldSmooth
      }
    },
    // Opponent develops Human tech
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move)
      }
    },
    // Opponent chooses Terra for WinInfluence
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.InfluenceDisc)(move)
          && this.material(game, MaterialType.InfluenceDisc).getItem(move.itemIndex).id === Influence.Terra
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-tech" defaults="Your opponent developed <bold>Human technology</bold> and gained 1 influence on a planet of their choice." components={{ bold: <strong/> }}/>,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.TechnologyBoard),
          this.material(game, MaterialType.TechMarker)
        ],
        margin: { top: 5, bottom: 3, right: 25 }
      })
    },

    // ===== TURN 3 P1: Take Leadership (steps 22–28) =====
    {
      popup: {
        text: () => <Trans i18nKey="tuto.discover-leadership" defaults="Time for the third action: <bold>Take Leadership</bold> (Diplomacy). This also requires discarding a card." components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leadership-explain" defaults="The <bold>Diplomacy board</bold> shows the 3 faction effects. Each one gives you the <bold>Leader Badge</bold> plus a faction bonus." components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      focus: () => ({
        locations: [
          this.location(LocationType.DiplomacyBoardAction).id(Faction.Animod).location,
          this.location(LocationType.DiplomacyBoardAction).id(Faction.Human).location,
          this.location(LocationType.DiplomacyBoardAction).id(Faction.Robot).location
        ],
        margin: { top: 10, bottom: 3, left: 2, right: 2 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leadership-discard" defaults="Discard <bold>Titus</bold> (Animod faction) to activate Animod diplomacy." components={{ bold: <strong/> }}/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me).id(Agent.Titus)
        ],
        locations: [
          this.location(LocationType.AgentCardFaction)
            .parent(this.material(game, MaterialType.AgentCard).id(Agent.Titus))
            .location
        ],
        margin: { top: 10 }
      }),
      move: {
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.AgentDiscard
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.Titus,
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.DiscardAction
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leadership-activate" defaults="Now <bold>activate the diplomacy</bold> to take the Leader Badge and mobilize 2 agents." components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      focus: () => ({
        locations: [
          this.location(LocationType.DiplomacyBoardAction).id(Faction.Animod).location
        ],
        margin: { top: 7, bottom: 3, left: 2, right: 2 }
      }),
      move: {}
    },
    {
      move: {
        filter: (move: MaterialMove) => isCustomMoveType(CustomMoveType.Diplomacy)(move),
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.Refill
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leader-badge" defaults="You now have the <bold>Leader Badge</bold>! It increases your hand limit: Silver side = 5 cards, Gold side = 6 cards." components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.LeaderBadgeToken)]
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.mobilize" defaults="<bold>Mobilize</bold> means drawing cards and placing them directly in your influence zone — without triggering their effects, but reducing future recruitment costs." components={{ bold: <strong/> }}/>,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.Influence).player(getTeamColor(me))
            .filter(item => item.id !== Agent.Mc4ffr3y)
        ],
        margin: { top: 15, bottom: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.draw-5" defaults="With the Leader Badge (Silver), you now draw up to <bold>5 cards</bold> instead of 4 at the end of your turn." components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      move: {}
    },

    // ===== TURN 3 P2: Opponent recruits LordCreep — Terra captured (steps 30–39) =====
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-turn" defaults="It's your opponent's turn to play..." />,
        position: { y: -15 }
      }
    },
    // Opponent recruits LordCreep
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.Influence
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.LordCreep
      }
    },
    // Opponent chooses Mars for WinInfluence (opponentSide)
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.InfluenceDisc)(move)
          && this.material(game, MaterialType.InfluenceDisc).getItem(move.itemIndex).id === Influence.Mars
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-captures" defaults="The opponent has <bold>captured Terra</bold>! Their influence disc reached their control zone and they won this planet's disc." components={{ bold: <strong/> }}/>,
        position: { y: -18 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.TeamPlanets)
        ],
        margin: { top: 7 }
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.bonus-tokens" defaults="Each planet and technology track has <bold>bonus tokens</bold>. The first team to capture a planet's disc earns that planet's bonus." components={{ bold: <strong/> }}/>,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.BonusToken)]
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-leader" defaults="The opponent also <bold>took the Leader Badge</bold> from you through a card effect. The badge changes hands throughout the game!" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.LeaderBadgeToken)]
      })
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.card-effects" defaults="Agent cards have many different effects. <bold>Click on any card</bold> during the game to see its effects in detail." components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.victory-recap" defaults='Remember: capture <bold>3 same-planet discs</bold>, <bold>4 different-planet discs</bold>, or <bold>5 total discs</bold> to win!' components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans i18nKey="tuto.good-luck" defaults="You now know the basics of <bold>Zenith</bold>! Recruit wisely, develop your technologies, and conquer the planets. Good luck!" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    }
  ]

  getNextMove(rules: MaterialRules<PlayerId, MaterialType, LocationType>) {
    const tutorial = rules.game.tutorial
    if (!tutorial || tutorial.step >= this.steps.length) return
    const step = this.steps[tutorial.step]
    if (!step?.move || step.move.player === undefined || step.move.player === rules.game.players[0]) return
    const moves = rules.getLegalMoves(step.move.player)
    if (step.move.filter) {
      const filtered = moves.filter(m => step.move!.filter!(m, rules.game))
      if (filtered.length > 0) return filtered[0]
    }
    return moves[0]
  }
}
