/** @jsxImportSource @emotion/react */
import { useGame, usePlayerId } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { ExpandedEffect, WinCreditEffect } from '@gamepark/zenith/material/effect/Effect'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { WinCreditRule } from '@gamepark/zenith/rules/effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const WinCreditHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new WinCreditRule(game)
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const { t } = useTranslation()
  const count = rules.remind<number>(Memory.Credit as number)
  const effect = rules.remind<ExpandedEffect<WinCreditEffect>>(Memory.CurrentEffect as number)
  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return <Trans defaults="header.win-credit" values={{ count: count }} components={{ ...HeaderTransComponents, source }} />
  }

  return (
    <Trans
      defaults="header.win-credit.player"
      values={{ team: t(`team.${getTeamColor(activePlayer)}`), count: count }}
      components={{ ...HeaderTransComponents, source }}
    />
  )
}
