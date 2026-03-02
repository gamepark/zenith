/** @jsxImportSource @emotion/react */
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

type AutoEffectHeaderProps = {
  i18nKey: string
  defaults: string
  defaultsMe: string
}

export const AutoEffectHeader: FC<AutoEffectHeaderProps> = ({ i18nKey, defaults, defaultsMe }) => {
  const rules = useRules<MaterialRules>()!
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const { t } = useTranslation()
  const effects = rules.remind<ExpandedEffect[]>(Memory.Effects)
  const effectSource = effects?.[0]?.effectSource
  const source = effectSource ? <EffectSource effectSource={effectSource} /> : <></>
  const components = { ...HeaderTransComponents, source }

  if (itsMe) {
    return <Trans i18nKey={`${i18nKey}.me`} defaults={defaultsMe} components={components} />
  }

  return (
    <Trans
      i18nKey={i18nKey}
      defaults={defaults}
      values={{ player: name, team: activePlayer ? t(`team.${getTeamColor(activePlayer)}`) : '' }}
      components={components}
    />
  )
}
