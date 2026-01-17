/** @jsxImportSource @emotion/react */
import { Animation, useAnimation, useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { isMoveItemType, MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
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
  const source = <EffectSource effectSource={effect.effectSource} />
  const winPlanet = useAnimation<MoveItem>(
    (a: Animation<MaterialMove>) => isMoveItemType(MaterialType.InfluenceDisc)(a.move) && a.move.location.type === LocationType.TeamPlanets
  )
  const components = { ...HeaderTransComponents, source }

  const team = getTeamColor(activePlayer)

  if (itsMe) {
    if (winPlanet && team === getTeamColor(me)) {
      const item = rules.material(MaterialType.InfluenceDisc).getItem<Influence>(winPlanet.move.itemIndex)
      return (
        <Trans i18nKey="header.win-planet" values={{ team: t(`team.${team}`) }} components={{ ...components, influenceIcon: getPlanetForHeader(item.id) }} />
      )
    }
    if (effect.influence) {
      return (
        <Trans
          i18nKey="header.influence.planet"
          values={{ count: effect.quantity ?? 1 }}
          components={{ ...components, influenceIcon: getPlanetForHeader(effect.influence) }}
        />
      )
    }

    return <Trans i18nKey="header.influence" components={components} />
  }

  if (winPlanet) {
    const item = rules.material(MaterialType.InfluenceDisc).getItem<Influence>(winPlanet.move.itemIndex)
    return (
      <Trans
        i18nKey="header.win-planet.player"
        values={{ team: t(`team.${team}`) }}
        components={{ ...components, influenceIcon: getPlanetForHeader(item.id) }}
      />
    )
  }

  if (effect.influence) {
    return (
      <Trans
        i18nKey="header.influence.planet.player"
        values={{ count: effect.quantity ?? 1, team: t(`team.${team}`) }}
        components={{ ...components, influenceIcon: getPlanetForHeader(effect.influence) }}
      />
    )
  }

  return <Trans i18nKey="header.influence.player" values={{ player: name, team: team }} components={components} />
}
