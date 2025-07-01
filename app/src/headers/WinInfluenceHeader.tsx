/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { WinInfluenceRule } from '@gamepark/zenith/rules/effect'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { Trans, useTranslation } from 'react-i18next'
import { getPlanetForHeader, HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const WinInfluenceHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new WinInfluenceRule(game)
  const { t } = useTranslation()
  const effect = rules.effect
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  console.log(effect.effectSource)
  const source = <EffectSource effectSource={effect.effectSource} />
  const components = { ...HeaderTransComponents, source }

  if (itsMe) {
    if (effect.influence) {
      return (
        <Trans
          defaults="header.influence.planet"
          values={{ count: effect.quantity ?? 1 }}
          components={{ ...components, influenceIcon: getPlanetForHeader(effect.influence) }}
        />
      )
    }

    return <Trans defaults="header.influence" components={components} />
  }

  const team = t(`team.${getTeamColor(activePlayer)}`)
  if (effect.influence) {
    return (
      <Trans
        defaults="header.influence.planet.player"
        values={{ count: effect.quantity ?? 1, team: team }}
        components={{ ...components, influenceIcon: getPlanetForHeader(effect.influence) }}
      />
    )
  }

  return <Trans defaults="header.influence.player" values={{ player: name, team: team }} components={components} />
}
