/** @jsxImportSource @emotion/react */
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { WinInfluenceRule } from '@gamepark/zenith/rules/effect'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { Trans } from 'react-i18next'
import { getPlanet, TransComponents } from '../i18n/trans.components'

export const WinInfluenceHeader = () => {
  const rules = useRules<WinInfluenceRule>()!
  const effect = rules.effect
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)

  if (itsMe) {
    if (effect.influence) {
      return (
        <Trans
          defaults="header.influence"
          values={{ count: effect.quantity ?? 1 }}
          components={{ ...TransComponents, influenceIcon: getPlanet(effect.influence) }}
        />
      )
    }

    return <Trans defaults="header.influence" />
  }

  return <Trans defaults="header.play.other" values={{ player: name }} components={TransComponents} />
}
