/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture, useGame, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { ExpandedEffect, TakeTechnologyBonusToken } from '@gamepark/zenith/material/effect/Effect'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { TakeTechnologyBonusTokenRule } from '@gamepark/zenith/rules/effect/TakeTechnologyBonusTokenRule'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { Trans, useTranslation } from 'react-i18next'
import { headerCss, HeaderTransComponents } from '../i18n/trans.components'
import { bonusTokenDescription } from '../material/BonusTokenDescription'
import { EffectSource } from './EffectSource'

export const TakeTechnologyBonusTokenHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new TakeTechnologyBonusTokenRule(game)
  const { t } = useTranslation()

  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const bonusId = rules.remind<Bonus>(Memory.WonBonus as number)
  const effect = rules.remind<ExpandedEffect<TakeTechnologyBonusToken>>(Memory.CurrentEffect as number)

  const source = <EffectSource effectSource={effect.effectSource} />
  const components = {
    ...HeaderTransComponents,
    source,
    bonusToken: <Picture src={bonusTokenDescription.images[bonusId]} css={[headerCss(false), bonusTokenCss]} />
  }

  if (itsMe) {
    return <Trans defaults="header.develop-techno.take-bonus" components={components} />
  }

  return (
    <Trans
      defaults="header.develop-techno.take-bonus.player"
      values={{ player: name, team: t(`team.${getTeamColor(activePlayer)}`) }}
      components={components}
    />
  )
}

const bonusTokenCss = css`
  border-radius: 0.5em;
`
