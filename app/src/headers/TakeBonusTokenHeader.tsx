/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { TakeBonusRule } from '@gamepark/zenith/rules/effect'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const TakeBonusTokenHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new TakeBonusRule(game)
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const effect = rules.effect
  const source = <EffectSource effectSource={effect.effectSource} />
  const components = { ...HeaderTransComponents, source }

  if (itsMe) {
    if (effect.visible) {
      return <Trans defaults="header.take-bonus.visible" components={components} />
    }

    return <Trans defaults="header.take-bonus" components={components} />
  }

  if (effect.visible) {
    return <Trans defaults="header.take-bonus.player.visible" values={{ player: name }} components={components} />
  }

  return <Trans defaults="header.take-bonus.player" values={{ player: name }} components={components} />
}
