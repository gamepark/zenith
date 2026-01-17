import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-game'
import { Agent } from '@gamepark/zenith/material/Agent'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { EffectSourceType } from '@gamepark/zenith/rules/Memory'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { getFactionForHeader, headerCss } from '../i18n/trans.components'
import { bonusTokenDescription } from '../material/BonusTokenDescription'

type EffectSourceProps = {
  effectSource: EffectSourceType
}

export const EffectSource: FC<EffectSourceProps> = ({ effectSource }) => {
  if (effectSource.type === MaterialType.BonusToken) {
    return <Picture src={bonusTokenDescription.images[effectSource.value as Bonus]} css={[headerCss(false), bonusTokenCss]} />
  }

  if (effectSource.type === MaterialType.DiplomacyBoard) {
    return <Trans i18nKey="header.source.diplomacy" />
  }
  if (effectSource.type === MaterialType.TechnologyBoard) {
    return (
      <Trans
        i18nKey="header.source.technology"
        components={{
          faction: getFactionForHeader(effectSource.value as Faction)
        }}
      />
    )
  }

  if (effectSource.type === MaterialType.AgentCard) {
    const agentId = effectSource.value as Agent
    return <Trans i18nKey={`agent.${agentId}`} />
  }

  return null
}

const bonusTokenCss = css`
  border-radius: 0.5em;
`
