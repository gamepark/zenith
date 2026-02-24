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
        text: () => <Trans defaults="tuto.welcome" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.planets" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.discs" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.victory" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.actions" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.recruit" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.recruit.done" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.end-turn" />,
        position: { y: -15 }
      },
      move: {}
    },

    // ===== TURN 1 P2: Opponent recruits Bruss0l0 (steps 8–9) =====
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent-turn" />,
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
        text: () => <Trans defaults="tuto.discover-tech" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.tech-boards" components={{ bold: <strong/> }}/>,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TechnologyBoard)],
        margin: { top: 5, bottom: 3, right: 25 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.tech-how" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.tech-discard" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.tech-develop" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.tech-done" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.opponent-turn" />,
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
        text: () => <Trans defaults="tuto.opponent-tech" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.discover-leadership" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.leadership-explain" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.leadership-discard" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.leadership-activate" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.leader-badge" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.LeaderBadgeToken)]
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.mobilize" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.draw-5" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      move: {}
    },

    // ===== TURN 3 P2: Opponent recruits LordCreep — Terra captured (steps 30–39) =====
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent-turn" />,
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
        text: () => <Trans defaults="tuto.opponent-captures" components={{ bold: <strong/> }}/>,
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
        text: () => <Trans defaults="tuto.bonus-tokens" components={{ bold: <strong/> }}/>,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.BonusToken)]
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent-leader" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.LeaderBadgeToken)]
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.card-effects" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.victory-recap" components={{ bold: <strong/> }}/>,
        position: { y: -15 }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.good-luck" components={{ bold: <strong/> }}/>,
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
