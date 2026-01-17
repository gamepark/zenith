/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { ExileEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { ExileRule } from '@gamepark/zenith/rules/effect'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export type ExileHeaderProps = {
  effect?: ExpandedEffect<ExileEffect>
}

export const ExileHeader: FC<ExileHeaderProps> = ({ effect }) => {
  const game = useGame<MaterialGame>()!
  const rules = new ExileRule(game)

  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const exileEffect = effect ?? rules.effect

  const source = <EffectSource effectSource={exileEffect.effectSource} />
  const components = { ...HeaderTransComponents, source }

  if (itsMe) {
    if (exileEffect.opponent) {
      return <Trans i18nKey="header.exile.opponent-area" values={{ count: exileEffect.quantity ?? 1 }} components={components} />
    }

    return <Trans i18nKey="header.exile" values={{ count: exileEffect.quantity ?? 1 }} components={components} />
  }

  if (exileEffect.opponent) {
    return <Trans i18nKey="header.exile.player.opponent-area" values={{ count: exileEffect.quantity ?? 1, player: name }} components={components} />
  }

  return <Trans i18nKey="header.exile.player" values={{ count: exileEffect.quantity ?? 1, player: name }} components={components} />
}
