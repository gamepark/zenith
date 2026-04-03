import { OptionsSpec, OptionsValidationError } from '@gamepark/rules-api'
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
  robotBoard: RobotBoard
  secretAgent?: boolean
}

export const ZenithOptionsSpec: OptionsSpec<ZenithOptions> = {
  competitivePlayers: { min: 2, max: 2 },
  // secretAgent: {
  //   label: (t) => t('option.secret-agent', 'Secret Agent expansion'),
  //   help: (t) => t('option.secret-agent.help', 'Add 10 new Secret Agent cards to the game'),
  //   subscriberRequired: true
  // },
  animodBoard: {
    label: (t) => t('board.animod', 'Animod board'),
    help: (t) => t('board.animod.help', 'Choose the side for the Animod technology board.'),
    values: ['S', 'D'] as AnimodBoard[],
    valueSpec: (value) => ({ label: (t) => t(`board.side.${value}`, `Side ${value}`) }),
    competitiveDisabled: true
  },
  humanBoard: {
    label: (t) => t('board.human', 'Human board'),
    help: (t) => t('board.human.help', 'Choose the side for the Human technology board.'),
    values: ['U', 'O'] as HumanBoard[],
    valueSpec: (value) => ({ label: (t) => t(`board.side.${value}`, `Side ${value}`) }),
    competitiveDisabled: true
  },
  robotBoard: {
    label: (t) => t('board.robot', 'Robot board'),
    help: (t) => t('board.robot.help', 'Choose the side for the Robot technology board.'),
    values: ['N', 'P'] as RobotBoard[],
    valueSpec: (value) => ({ label: (t) => t(`board.side.${value}`, `Side ${value}`) }),
    competitiveDisabled: true
  },
  players: {
    team: {
      label: (t) => t('team', 'Team'),
      help: (t) => t('team.help', 'Choose which team you want to play on.'),
      values: teamColors,
      valueSpec: (color) => ({ label: (t) => t(`team.${color}`, color === TeamColor.White ? 'White' : 'Black') }),
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
