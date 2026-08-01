import { OptionsSpec, OptionsSpecV2, OptionsValidationError } from '@gamepark/rules-api'
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

/**
 * The legacy declaration, superseded by `ZenithOptionsSpecV2`.
 *
 * Kept exported only because a few platform screens still read the v1 spec for
 * its labels and per-player options; nothing here should be edited any more, and
 * the whole object goes once those screens have moved. `validate` is dead code
 * for game creation already: the platform generates from the v2 spec, which can
 * no longer produce a table this function would refuse.
 */
export const ZenithOptionsSpec: OptionsSpec<ZenithOptions> = {
  competitivePlayers: { min: 2, max: 2 },
  secretAgent: {
    label: (t) => t('option.secret-agent'),
    help: (t) => t('option.secret-agent.help'),
    subscriberRequired: true
  },
  animodBoard: {
    label: (t) => t('board.animod'),
    help: (t) => t('board.animod.help'),
    values: ['S', 'D'] as AnimodBoard[],
    valueSpec: (value) => ({ label: (t) => t(`board.side.${value}`) }),
    competitiveDisabled: true
  },
  humanBoard: {
    label: (t) => t('board.human'),
    help: (t) => t('board.human.help'),
    values: ['U', 'O'] as HumanBoard[],
    valueSpec: (value) => ({ label: (t) => t(`board.side.${value}`) }),
    competitiveDisabled: true
  },
  robotBoard: {
    label: (t) => t('board.robot'),
    help: (t) => t('board.robot.help'),
    values: ['N', 'P'] as RobotBoard[],
    valueSpec: (value) => ({ label: (t) => t(`board.side.${value}`) }),
    competitiveDisabled: true
  },
  players: {
    team: {
      label: (t) => t('team'),
      help: (t) => t('team.help'),
      values: teamColors,
      valueSpec: (color) => ({ label: (t) => t(`team.${color}`) }),
      competitiveDisabled: true
    }
  },
  validate: (options, t) => {
    if (options.players) {
      const count = options.players.length
      if (count !== 2 && count !== 4) {
        throw new OptionsValidationError(t('invalid.player.count'), ['players'])
      }
      const white = options.players.filter((p) => p.team === TeamColor.White).length
      const black = options.players.filter((p) => p.team === TeamColor.Black).length
      if (white !== black) {
        throw new OptionsValidationError(t('invalid.teams'), ['players.team'])
      }
    }
  }
}
