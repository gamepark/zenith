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
}

export const ZenithOptionsSpec: OptionsSpec<ZenithOptions> = {
  animodBoard: {
    label: t => t('board.animod'),
    help: t => t('board.animod.help'),
    values: ['S', 'D'] as AnimodBoard[],
    valueSpec: value => ({ label: t => t(`board.side.${value}`) }),
    competitiveDisabled: true
  },
  humanBoard: {
    label: t => t('board.human'),
    help: t => t('board.human.help'),
    values: ['U', 'O'] as HumanBoard[],
    valueSpec: value => ({ label: t => t(`board.side.${value}`) }),
    competitiveDisabled: true
  },
  robotBoard: {
    label: t => t('board.robot'),
    help: t => t('board.robot.help'),
    values: ['N', 'P'] as RobotBoard[],
    valueSpec: value => ({ label: t => t(`board.side.${value}`) }),
    competitiveDisabled: true
  },
  players: {
    team: {
      label: t => t('team'),
      help: t => t('team.help'),
      values: teamColors,
      valueSpec: color => ({ label: t => t(`team.${color}`) }),
      competitiveDisabled: true
    }
  },
  validate: (options, t) => {
    if (options.players) {
      const count = options.players.length
      if (count !== 2 && count !== 4) {
        throw new OptionsValidationError(t('invalid.player.count'), ['players'])
      }
      const white = options.players.filter(p => p.team === TeamColor.White).length
      const black = options.players.filter(p => p.team === TeamColor.Black).length
      if (white !== black) {
        throw new OptionsValidationError(t('invalid.teams'), ['players.team'])
      }
    }
  }
}
