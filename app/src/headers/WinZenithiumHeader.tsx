/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { ExpandedEffect, WinZenithiumEffect } from '@gamepark/zenith/material/effect/Effect'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { WinZenithiumRule } from '@gamepark/zenith/rules/effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const WinZenithiumHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new WinZenithiumRule(game)
  const { t } = useTranslation()
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const count = rules.remind<number>(Memory.Zenithium as number)
  const effect = rules.remind<ExpandedEffect<WinZenithiumEffect>>(Memory.CurrentEffect as number)
  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe && !effect.opponent) {
    return <Trans defaults="header.win-zenithium" values={{ count: count }} components={{ ...HeaderTransComponents, source }} />
  }

  const activeTeam = getTeamColor(activePlayer)
  const targetTeam = effect.opponent ? rules.opponentTeam : activeTeam
  return (
    <Trans defaults="header.win-zenithium.player" values={{ team: t(`team.${targetTeam}`), count: count }} components={{ ...HeaderTransComponents, source }} />
  )
}
