import { OptionsSpecV2 } from '@gamepark/rules-api'
import { TeamColor, teamColors } from './TeamColor'

type PlayerOptions = {
  team?: TeamColor
}

export type AnimodBoard = 'S' | 'D'
export type HumanBoard = 'U' | 'O'
export type RobotBoard = 'N' | 'P'

export type ZenithOptions = {
  players: PlayerOptions[]
  animodBoard: AnimodBoard
  humanBoard: HumanBoard
  robotBoard: RobotBoard,
  secretAgent: boolean
}

/**
 * What Zenith is: three boards each played on one of its two sides, a variant,
 * and two camps sharing the table.
 *
 * `teams` says the last one, and says it completely. Two camps of equal size
 * means 2 or 4 players, never 3 — the platform derives the legal table sizes
 * from the declaration and assigns the camps balanced, so the two rules the old
 * `validate` below threw for are no longer Zenith's to state.
 *
 * What is deliberately absent is as telling as what is here. No label, no help,
 * no side name: a v2 spec carries no text, which lives in the options document
 * published with the game's translations, under the keys the platform derives
 * from this spec. And no `subscriberRequired` / `competitiveDisabled` /
 * `competitivePlayers` either: whether the secret agent needs a subscription and
 * which boards competitive play fixes are the platform's call, held in the
 * database so they can change without releasing Zenith again.
 */
export const ZenithOptionsSpecV2: OptionsSpecV2 = {
  specVersion: 2,
  players: { min: 2, max: 4 },
  options: {
    secretAgent: { kind: 'boolean' },
    animodBoard: { kind: 'enum', values: ['S', 'D'] },
    humanBoard: { kind: 'enum', values: ['U', 'O'] },
    robotBoard: { kind: 'enum', values: ['N', 'P'] }
  },
  teams: { values: teamColors }
}
