/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { ResetInfluenceRule } from '@gamepark/zenith/rules/effect'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const ResetInfluenceHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new ResetInfluenceRule(game)
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const effect = rules.effect
  const source = <EffectSource effectSource={effect.effectSource} />
  const components = { ...HeaderTransComponents, source }

  if (itsMe) {
    return <Trans i18nKey="header.reset-influence" components={components} />
  }

  return <Trans i18nKey="header.reset-influence.player" values={{ player: name }} components={components} />
}
