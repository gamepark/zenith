import { PlayMoveButton, useGame, useLegalMove, usePlayerId } from '@gamepark/react-game'
import { isCustomMoveType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { ChoiceEffect, ExpandedEffect, WinInfluenceEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Influence } from '@gamepark/zenith/material/Influence'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Choice, ChoiceRule } from '@gamepark/zenith/rules/effect'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TooltipButton } from '../components/TooltipButton'
import { getPlanetForHeader, HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const ChoiceHeader: FC = () => {
  const game = useGame<MaterialGame>()!
  const rules = new ChoiceRule(game)
  const effect = rules.effect

  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const { t } = useTranslation()

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return (
      <Trans
        i18nKey="header.choice"
        components={{
          ...HeaderTransComponents,
          source,
          effect1: <ChoiceEffectButton choice={Choice.LEFT} choiceEffect={effect} interactive />,
          effect2: <ChoiceEffectButton choice={Choice.RIGHT} choiceEffect={effect} interactive />
        }}
      />
    )
  }

  return (
    <Trans
      i18nKey="header.choice.player"
      values={{ player: t(`team.${new PlayerHelper(game, activePlayer!).team}`) }}
      components={{
        ...HeaderTransComponents,
        source,
        effect1: <ChoiceEffectButton choice={Choice.LEFT} choiceEffect={effect} interactive={false} />,
        effect2: <ChoiceEffectButton choice={Choice.RIGHT} choiceEffect={effect} interactive={false} />
      }}
    />
  )
}

type ChoiceEffectType = {
  choice: Choice
  choiceEffect: ExpandedEffect<ChoiceEffect>
  interactive: boolean
}
const ChoiceEffectButton: FC<ChoiceEffectType> = ({ choice, choiceEffect, interactive }) => {
  const { t } = useTranslation()
  const chosen = choice === Choice.RIGHT ? choiceEffect.right : choiceEffect.left
  const effects = Array.isArray(chosen) ? chosen : [chosen]
  const move = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Choice)(move) && move.data === choice)

  const wrap = (tooltip: string | undefined, content: React.ReactElement) => {
    if (!interactive) return content
    const button = <PlayMoveButton move={move}>{content}</PlayMoveButton>
    return tooltip ? <TooltipButton tooltip={tooltip}>{button}</TooltipButton> : button
  }

  // Multi-effect branch (e.g. influence multiple planets)
  if (effects.length > 1 && effects.every((e) => e.type === EffectType.WinInfluence)) {
    const planets = effects.map((e) => (e as WinInfluenceEffect).influence).filter(Boolean) as Influence[]
    const components: Record<string, React.ReactElement> = { ...HeaderTransComponents }
    planets.forEach((planet, i) => {
      components[`planet${i}`] = getPlanetForHeader(planet)
    })
    return wrap(
      undefined,
      <Trans
        i18nKey={`header.choice.win-influence.${planets.length}`}
        defaults={planets.map((_, i) => `<planet${i}/>`).join(' + ')}
        components={components}
      />
    )
  }

  const effect = effects[0]

  if (effect.type === EffectType.WinCredit) {
    return wrap(
      t('tooltip.win-credit', { count: effect.quantity }),
      <Trans i18nKey="header.choice.win-credit" values={{ count: effect.quantity }} components={HeaderTransComponents} />
    )
  }

  if (effect.type === EffectType.WinZenithium) {
    return wrap(
      t('tooltip.win-zenithium', { count: effect.quantity ?? 1 }),
      <Trans i18nKey="header.choice.win-zenithium" values={{ count: effect.quantity ?? 1 }} components={HeaderTransComponents} />
    )
  }

  if (effect.type === EffectType.TakeLeaderBadge) {
    return wrap(
      t('tooltip.take-leader'),
      <Trans
        i18nKey="header.choice.take-leader"
        components={{ ...HeaderTransComponents, leaderBadge: effect.gold ? HeaderTransComponents.leaderGold : HeaderTransComponents.leaderSilver }}
      />
    )
  }

  if (effect.type === EffectType.Transfer) {
    return wrap(
      t('tooltip.transfer', { count: effect.quantity ?? 1 }),
      <Trans i18nKey="header.choice.transfert" values={{ count: effect.quantity ?? 1 }} components={HeaderTransComponents} />
    )
  }

  return null
}
