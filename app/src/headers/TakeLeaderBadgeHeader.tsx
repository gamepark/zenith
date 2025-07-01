/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { ExpandedEffect, TakeLeaderBadgeEffect } from '@gamepark/zenith/material/effect/Effect'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { TakeLeaderBadgeRule } from '@gamepark/zenith/rules/effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const TakeLeaderBadgeHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new TakeLeaderBadgeRule(game)
  const { t } = useTranslation()

  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const effect = rules.remind<ExpandedEffect<TakeLeaderBadgeEffect>>(Memory.CurrentEffect as number)
  const badge = rules.material(MaterialType.LeaderBadgeToken).getItem()!
  const goldSide = badge.location.player === getTeamColor(activePlayer) || effect.gold

  const source = <EffectSource effectSource={effect.effectSource} />
  const components = {
    ...HeaderTransComponents,
    source,
    leaderBadge: goldSide ? HeaderTransComponents.leaderGold : HeaderTransComponents.leaderSilver
  }

  if (itsMe) {
    return <Trans defaults="header.take-badge" components={components} />
  }

  return <Trans defaults="header.take-badge.player" values={{ player: name, team: t(`team.${getTeamColor(activePlayer)}`) }} components={components} />
}
