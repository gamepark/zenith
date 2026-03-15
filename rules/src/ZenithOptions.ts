import { OptionsSpec, OptionsValidationError } from '@gamepark/rules-api'
import { TeamColor, teamColors } from './TeamColor'

type PlayerOptions = {
  team?: TeamColor
}

export type ZenithOptions = {
  players: PlayerOptions[]
  beginner: boolean
}

export const ZenithOptionsSpec: OptionsSpec<ZenithOptions> = {
  beginner: {
    label: t => t('beginner'),
    help: t => t('beginner.help'),
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
    if (options.players && options.players.length === 4) {
      const white = options.players.filter(p => p.team === TeamColor.White).length
      const black = options.players.filter(p => p.team === TeamColor.Black).length
      if (white > 2 || black > 2) {
        throw new OptionsValidationError(t('invalid.teams'), ['players.team'])
      }
    }
  }
}
