/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { DiscardEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { DiscardRule } from '@gamepark/zenith/rules/effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const DiscardHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new DiscardRule(game)
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const effect = rules.remind<ExpandedEffect<DiscardEffect>>(Memory.CurrentEffect as number)
  const source = <EffectSource effectSource={effect.effectSource} />
  const components = { ...HeaderTransComponents, source }
  if (itsMe) {
    if (effect.full) {
      return <Trans defaults="header.discard.full" components={components} />
    }
    return <Trans defaults="header.discard" values={{ count: 1 }} components={components} />
  }
  if (effect.full) {
    return <Trans defaults="header.discard.full.player" values={{ player: name }} components={components} />
  }
  return <Trans defaults="header.discard.player" values={{ count: 1, player: name }} components={components} />
}
