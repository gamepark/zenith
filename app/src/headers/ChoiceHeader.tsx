import { PlayMoveButton, useGame, useLegalMove, usePlayerId } from '@gamepark/react-game'
import { isCustomMoveType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { ChoiceEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Choice, ChoiceRule } from '@gamepark/zenith/rules/effect'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TooltipButton } from '../components/TooltipButton'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const ChoiceHeader: FC = () => {
  const game = useGame<MaterialGame>()!
  const rules = new ChoiceRule(game)
  const effect = rules.effect

  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return (
      <Trans
        defaults="header.choice"
        components={{
          ...HeaderTransComponents,
          source,
          effect1: <ChoiceEffectButton choice={Choice.LEFT} choiceEffect={effect} />,
          effect2: <ChoiceEffectButton choice={Choice.RIGHT} choiceEffect={effect} />
        }}
      />
    )
  }

  return null
}

type ChoiceEffectType = {
  choice: Choice
  choiceEffect: ExpandedEffect<ChoiceEffect>
}
const ChoiceEffectButton: FC<ChoiceEffectType> = ({ choice, choiceEffect }) => {
  const { t } = useTranslation()
  const effect = choice === Choice.RIGHT ? choiceEffect.right : choiceEffect.left
  const move = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Choice)(move) && move.data === choice)

  if (effect.type === EffectType.WinCredit) {
    return (
      <TooltipButton tooltip={t('tooltip.win-credit', { count: effect.quantity })}>
        <PlayMoveButton move={move}>
          <Trans defaults="header.choice.win-credit" values={{ count: effect.quantity }} components={HeaderTransComponents} />
        </PlayMoveButton>
      </TooltipButton>
    )
  }

  if (effect.type === EffectType.WinZenithium) {
    return (
      <TooltipButton tooltip={t('tooltip.win-zenithium', { count: effect.quantity ?? 1 })}>
        <PlayMoveButton move={move}>
          <Trans defaults="header.choice.win-zenithium" values={{ count: effect.quantity ?? 1 }} components={HeaderTransComponents} />
        </PlayMoveButton>
      </TooltipButton>
    )
  }

  if (effect.type === EffectType.TakeLeaderBadge) {
    return (
      <TooltipButton tooltip={t('tooltip.take-leader')}>
        <PlayMoveButton move={move}>
          <Trans
            defaults="header.choice.take-leader"
            components={{ ...HeaderTransComponents, leaderBadge: effect.gold ? HeaderTransComponents.leaderGold : HeaderTransComponents.leaderSilver }}
          />
        </PlayMoveButton>
      </TooltipButton>
    )
  }

  if (effect.type === EffectType.Transfer) {
    return (
      <TooltipButton tooltip={t('tooltip.transfer', { count: effect.quantity ?? 1 })}>
        <PlayMoveButton move={move}>
          <Trans defaults="header.choice.transfert" values={{ count: effect.quantity ?? 1 }} components={HeaderTransComponents} />
        </PlayMoveButton>
      </TooltipButton>
    )
  }

  return null
}
