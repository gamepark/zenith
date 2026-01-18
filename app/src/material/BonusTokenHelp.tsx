/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { Bonuses } from '@gamepark/zenith/material/Bonuses'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { EffectText } from '../components/EffectText'

export const BonusTokenHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const bonusId = item.id as Bonus
  const bonusEffect = Bonuses[bonusId]?.effect

  return (
    <div css={containerCss}>
      <div css={titleCss}>{t('help.bonus.title')}</div>
      <div css={descriptionCss}>
        {bonusEffect && <EffectText effect={bonusEffect} />}
      </div>
    </div>
  )
}

const containerCss = css`
  min-width: 15em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

const titleCss = css`
  font-size: 1.1em;
  font-weight: 700;
  color: #1f2937;
`

const descriptionCss = css`
  font-size: 1em;
  color: #374151;
  line-height: 1.5;
`
