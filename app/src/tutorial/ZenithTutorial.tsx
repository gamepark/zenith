/** @jsxImportSource @emotion/react */
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isCustomMoveType, isDeleteItemType, isMoveItemType, isStartRule, MaterialGame, MaterialMove, MaterialRules } from '@gamepark/rules-api'
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
import { HelpTransComponents } from '../i18n/trans.components'

/** Steps where the diplomacy board should be displayed horizontally (no rotation) */
export const DIPLOMACY_BOARD_HORIZONTAL_STEPS = [29, 31]

const tc = HelpTransComponents

export class ZenithTutorial extends MaterialTutorial<PlayerId, MaterialType, LocationType> {
  version = 3
  options = { players: [{ id: me }, { id: opponent }] }
  setup = new TutorialSetup()
  players = [
    { id: me },
    { id: opponent, name: 'Rival' }
  ]

  steps: TutorialStep<PlayerId, MaterialType, LocationType>[] = [
    // ===== INTRODUCTION (steps 0–4) =====
    // Step 0
    {
      popup: {
        text: () => <Trans i18nKey="tuto.welcome" defaults="Welcome to the <bold>Zenith</bold> tutorial!" components={tc} />,
        position: { y: -15 }
      }
    },
    // Step 1
    {
      popup: {
        text: () => <Trans i18nKey="tuto.planets" defaults="In Zenith, you and your opponent compete to gain <bold>Influence</bold> on these 5 planets." components={tc} />,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace)
        ],
        margin: { top: 10, bottom: 5, left: 5, right: 5 }
      })
    },
    // Step 2
    {
      popup: {
        text: () => <Trans i18nKey="tuto.discs" defaults="To win an <bold>Influence disc</bold>, you must push it all the way to the end of the track on your side." components={tc} />,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace)
        ],
        margin: { top: 10, bottom: 5, left: 5, right: 5 }
      })
    },
    // Step 3
    {
      popup: {
        text: () => <Trans i18nKey="tuto.victory" defaults="You can win in 3 different ways:<br/>• <bold>Absolute Victory</bold>: win <bold>3</bold> Influence discs from the <bold>same planet</bold>.<br/>• <bold>Democratic Victory</bold>: win <bold>4</bold> Influence discs from strictly <bold>different</bold> planets.<br/>• <bold>Popular Victory</bold>: win <bold>5</bold> Influence discs (from any combination of planets)." components={tc} />,
        position: { y: -15 }
      }
    },
    // Step 4
    {
      popup: {
        text: () => <Trans i18nKey="tuto.actions" defaults="Here is your hand of <bold>Agent cards</bold>. On your turn, you must play an Agent to perform <bold>one of these 3 actions</bold>:<br/>• Recruit the Agent<br/>• Develop a Technology<br/>• Take Leadership" components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me)
        ],
        margin: { top: 10 }
      })
    },

    // ===== TURN 1 P1: Recruit Mc4ffr3y (steps 5–10) =====
    // Step 5
    {
      popup: {
        text: () => <Trans i18nKey="tuto.recruit" defaults="It's your turn. <bold>Recruit this Agent</bold> by placing it on your side of the Planet board, in its matching zone (Mars)." components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me).id(Agent.Mc4ffr3y),
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace).id(Influence.Mars)
        ],
        margin: { top: 10 }
      }),
      move: {
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.Influence
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.Mc4ffr3y,
        interrupt: (move: MaterialMove) => isDeleteItemType(MaterialType.CreditToken)(move)
      }
    },
    // Step 6 — explain credits cost (card placed, credits not yet paid). Release credits, interrupt before influence disc.
    {
      popup: {
        text: () => <Trans i18nKey="tuto.recruit.cost" defaults="When you recruit an Agent, you must pay its cost in <bold>Credits</bold>.<br/>You start the game with <bold>12 Credits</bold>." components={tc} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.CreditToken).location(LocationType.TeamCredit).player(getTeamColor(me))
        ],
        margin: { top: 10 }
      }),
      move: {
        interrupt: (move: MaterialMove) => isMoveItemType(MaterialType.InfluenceDisc)(move)
      }
    },
    // Step 7 — explain effects (credits paid, influence not yet moved)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.recruit.effects" defaults="After recruiting an Agent, <bold>you apply its effects</bold>." components={tc} />,
        position: { y: -15 }
      }
    },
    // Step 8 — explain influence effect. Release disc move, interrupt before zenithium.
    {
      popup: {
        text: () => <Trans i18nKey="tuto.recruit.influence" defaults="The first effect of an agent is always the same: <bold>gain 1 Influence</bold> on its planet." components={tc} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace).id(Influence.Mars)
        ],
        margin: { top: 10 }
      }),
      move: {
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.WinZenithium
      }
    },
    // Step 9 — explain zenithium effect (influence moved, zenithium not yet gained)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.recruit.zenithium" defaults="The second effect of this agent gives you <bold>2 Zenithium</bold>.<br/><italic>Zenithium is used to develop Technologies.</italic>" components={tc} />,
        position: { y: -15 }
      },
      move: {
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.Refill
      }
    },
    // Step 10 — end turn, release refill
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end-turn" defaults="At the end of your turn, you draw Agent cards until you have at least 4 cards." components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me),
          this.material(game, MaterialType.AgentCard).location(LocationType.AgentDeck)
        ],
        margin: { top: 15, bottom: 5, left: 5, right: 5 }
      }),
      move: {}
    },

    // ===== TURN 1 P2: Opponent recruits Bruss0l0 (steps 11–13) =====
    // Step 11
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-turn" defaults="It's your opponent's turn." />,
        position: { y: -15 }
      }
    },
    // Step 12
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.Influence
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.Bruss0l0
      }
    },
    // Step 13
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-recruit" defaults="Your opponent has recruited this agent." components={tc} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.Influence).id(Agent.Bruss0l0)
        ],
        margin: { top: 10 }
      })
    },

    // ===== TURN 2 P1: Develop Animod tech (steps 14–22) =====
    // Step 14
    {
      popup: {
        text: () => <Trans i18nKey="tuto.discover-tech" defaults="It's your turn. Time to discover the 2nd action: <bold>develop a Technology</bold>." components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me)
        ],
        margin: { top: 10 }
      })
    },
    // Step 15
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-boards" defaults="Here is the <bold>Technology board</bold>. It changes every game.<br/>In Zenith, there are 3 Factions: Animod <animod/>, Human <human/>, and Robot <robot/>.<br/>Each Faction has its own Technology track." components={tc} />,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.TechnologyBoard)],
        margin: { top: 5, bottom: 3, right: 25 }
      })
    },
    // Step 16
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-how" defaults="To develop a technology, you must:<br/>• <bold>Discard an Agent card of the matching Faction</bold><br/>• <bold>Pay the cost in Zenithium for the next Technology level</bold> (from 1 to 5)" components={tc} />,
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
    // Step 17
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-discard" defaults="Discard this card to develop Animod Technology." components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me).id(Agent.Elisabeth)
        ],
        locations: [
          this.location(LocationType.AgentDiscard).location
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
    // Step 18
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-develop" defaults="After clicking OK, choose <bold>Develop Technology</bold> in the action popup." components={tc} />,
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
    // Step 19
    {
      move: {
        filter: (move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move),
        interrupt: (move: MaterialMove) => isDeleteItemType(MaterialType.ZenithiumToken)(move)
      }
    },
    // Step 20 — release zenithium payment, interrupt before refill
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-done" defaults="This level 1 Technology costs <bold>1 Zenithium</bold>. You gain 2 Credits." components={tc} />,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.TechnologyBoard).location(LocationType.TechnologyBoardPlace).locationId(Faction.Animod),
          this.material(game, MaterialType.TechMarker).player(getTeamColor(me)),
          this.material(game, MaterialType.CreditToken).location(LocationType.TeamCredit).player(getTeamColor(me)),
          this.material(game, MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(getTeamColor(me))
        ],
        margin: { top: 5, right: 25 }
      }),
      move: {
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.Refill
      }
    },
    // Step 21
    {
      popup: {
        text: () => <Trans i18nKey="tuto.tech-cumulative" defaults="Technologies cost more and more to develop, however you gain the effects of the level reached <bold>as well as all lower levels in the column</bold>!" components={tc} />,
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
    // Step 22 — release refill, focus on hand + deck
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end-turn-2" defaults="Your turn is over, you draw cards to have 4 in hand." components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me),
          this.material(game, MaterialType.AgentCard).location(LocationType.AgentDeck)
        ],
        margin: { top: 15, bottom: 5, left: 5, right: 5 }
      }),
      move: {}
    },

    // ===== TURN 2 P2: Opponent develops Human tech (steps 23–27) =====
    // Step 23
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-turn" defaults="It's your opponent's turn." />,
        position: { y: -15 }
      }
    },
    // Step 24: Opponent discards DonaldSmooth
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.AgentDiscard
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.DonaldSmooth
      }
    },
    // Step 25: Opponent develops Human tech
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move)
      }
    },
    // Step 26: Opponent chooses Terra for WinInfluence
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.InfluenceDisc)(move)
          && this.material(game, MaterialType.InfluenceDisc).getItem(move.itemIndex).id === Influence.Terra
      }
    },
    // Step 27
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-tech" defaults="Your opponent has developed this technology." components={tc} />,
        position: { x: 40 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.TechnologyBoard).location(LocationType.TechnologyBoardPlace).locationId(Faction.Human),
          this.material(game, MaterialType.TechMarker).player(getTeamColor(opponent))
        ],
        margin: { top: 5, bottom: 3, right: 25 }
      })
    },

    // ===== TURN 3 P1: Take Leadership (steps 28–37) =====
    // Step 28
    {
      popup: {
        text: () => <Trans i18nKey="tuto.discover-leadership" defaults="It's your turn. You will discover the 3rd and final action: <bold>Take Leadership</bold>." components={tc} />,
        position: { y: -15 }
      }
    },
    // Step 29
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leadership-explain" defaults="To take Leadership, simply <bold>discard an Agent card</bold> and apply the effects shown on this board." components={tc} />,
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
    // Step 30
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leadership-discard" defaults="Discard this card." components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.PlayerHand).player(me).id(Agent.Titus)
        ],
        locations: [
          this.location(LocationType.AgentDiscard).location
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
    // Step 31
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leadership-activate" defaults="After clicking OK, choose <bold>Take Leadership</bold> in the action popup." components={tc} />,
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
    // Step 32 — Diplomacy move, interrupt before leader badge
    {
      move: {
        filter: (move: MaterialMove) => isCustomMoveType(CustomMoveType.Diplomacy)(move),
        interrupt: (move: MaterialMove) => isMoveItemType(MaterialType.LeaderBadgeToken)(move)
      }
    },
    // Step 33 — explain leader badge intro, release badge, interrupt before mobilize
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leader-badge-intro" defaults="When you take Leadership, the first effect is always to <bold>receive the Leader Badge</bold>." components={tc} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.LeaderBadgeToken)]
      }),
      move: {
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.Mobilize
      }
    },
    // Step 34 — leader badge details (text only)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.leader-badge" defaults="The Leader Badge increases your hand size to 5. <bold>You will draw up to 5 cards</bold> at the end of your turn.<br/>If you take the Leader Badge while you already have it, you flip it and your limit becomes 6 cards.<br/><italic>The Leader Badge is also a prerequisite for some Agent effects.</italic>" components={tc} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.LeaderBadgeToken)]
      })
    },
    // Step 35 — explain mobilize, release mobilize, interrupt before refill
    {
      popup: {
        text: () => <Trans i18nKey="tuto.mobilize" defaults="When you use an Animod to take Leadership, you also benefit from the Mobilize 2 effect.<br/>With this effect, you draw 2 Agent cards and place them directly in play." components={tc} />,
        position: { y: -25 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).location(LocationType.Influence).player(getTeamColor(me))
            .filter(item => item.id !== Agent.Mc4ffr3y)
        ],
        margin: { top: 15, bottom: 5 }
      }),
      move: {
        interrupt: (move: MaterialMove) => isStartRule(move) && move.id === RuleId.Refill
      }
    },
    // Step 36 — mobilize details (text only)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.mobilize-detail" defaults="You don't pay the cost of mobilized cards, but <bold>you don't get their effects either</bold>!<br/>It's still useful, because each card in play gives you <bold>a 1-credit discount</bold> on the next Agents of the same planet you recruit." components={tc} />,
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
    // Step 37 — release refill
    {
      popup: {
        text: () => <Trans i18nKey="tuto.draw-5" defaults="Now, you draw cards to have <bold>5</bold> in hand." components={tc} />,
        position: { y: -15 }
      },
      move: {}
    },

    // ===== TURN 3 P2: Opponent recruits LordCreep — Terra captured (steps 38–47) =====
    // Step 38
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-turn" defaults="It's your opponent's turn." />,
        position: { y: -15 }
      }
    },
    // Step 39: Opponent recruits LordCreep
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.AgentCard)(move)
          && move.location.type === LocationType.Influence
          && this.material(game, MaterialType.AgentCard).getItem(move.itemIndex).id === Agent.LordCreep
      }
    },
    // Step 40: Opponent chooses Terra for WinInfluence
    {
      move: {
        player: opponent,
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.InfluenceDisc)(move)
          && this.material(game, MaterialType.InfluenceDisc).getItem(move.itemIndex).id === Influence.Terra
      }
    },
    // Step 41
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-captures" defaults="Your opponent played this Agent. They gained the last Influence needed to win this Influence disc on Terra!" components={tc} />,
        position: { y: -18 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AgentCard).id(Agent.LordCreep),
          this.material(game, MaterialType.InfluenceDisc).id(Influence.Terra)
        ],
        margin: { top: 7 }
      })
    },
    // Step 42
    {
      popup: {
        text: () => <Trans i18nKey="tuto.bonus-tokens" defaults="The first player to win an Influence disc earns <bold>the associated Bonus token</bold>." components={tc} />,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.BonusToken).location(LocationType.PlanetBoardBonusSpace)]
      })
    },
    // Step 43
    {
      popup: {
        text: () => <Trans i18nKey="tuto.bonus-tokens-tech" defaults="There are also 3 bonus tokens for the first player to reach level 2 of a Technology." components={tc} />,
        position: { y: -20 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.BonusToken).location(LocationType.TechnologyBoardBonusSpace)]
      })
    },
    // Step 44
    {
      popup: {
        text: () => <Trans i18nKey="tuto.opponent-leader" defaults="With their Agent, your opponent also <bold>took the Leader Badge</bold> from you." components={tc} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.LeaderBadgeToken)]
      })
    },
    // Step 45
    {
      popup: {
        text: () => <Trans i18nKey="tuto.card-effects" defaults="Agents cost from 1 to 10 Credits, and their effects are very varied.<br/><bold>At any time, click on a card to discover its effects.</bold>" components={tc} />,
        position: { y: -15 }
      }
    },
    // Step 46
    {
      popup: {
        text: () => <Trans i18nKey="tuto.victory-recap" defaults="The game ends as soon as a player has <bold>3 identical planet discs</bold>, <bold>4 different discs</bold>, or <bold>5 discs</bold>. That player wins the game." components={tc} />,
        position: { y: -15 }
      }
    },
    // Step 47
    {
      popup: {
        text: () => <Trans i18nKey="tuto.good-luck" defaults="Now it's your turn to play: can you unite the solar system?<br/>Good luck!" components={tc} />,
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
