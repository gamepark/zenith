/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Influence } from '@gamepark/zenith/material/Influence'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const InfluenceDiscHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const influence = item.id as Influence

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <span css={titleCss}>{t('help.influence.title')}</span>
        <span css={planetNameCss}>{t(`planet.${influence}`)}</span>
      </div>

      <div css={descCss}>{t('help.influence.desc')}</div>

      <div css={mechanismCss}>
        <div css={mechanismTitleCss}>{t('help.influence.mechanism')}</div>
        <div css={mechanismDescCss}>{t('help.influence.mechanism.desc')}</div>
      </div>

      <div css={sectionCss}>
        <div css={sectionTitleCss}>{t('help.influence.how-to-gain')}</div>
        <ul css={listCss}>
          <li>{t('help.influence.gain.recruit')}</li>
          <li>{t('help.influence.gain.bonus')}</li>
          <li>{t('help.influence.gain.tech')}</li>
        </ul>
      </div>

      <div css={victoryCss}>
        <div css={victoryTitleCss}>{t('help.planet-board.victory')}</div>
        <ul css={victoryListCss}>
          <li>{t('help.planet-board.victory.absolute')}</li>
          <li>{t('help.planet-board.victory.democratic')}</li>
          <li>{t('help.planet-board.victory.popular')}</li>
        </ul>
      </div>
    </div>
  )
}

const containerCss = css`
  min-width: 16em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const headerCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const titleCss = css`
  font-size: 1.1em;
  font-weight: 700;
  color: #1f2937;
`

const planetNameCss = css`
  font-size: 0.95em;
  color: #6b7280;
`

const descCss = css`
  font-size: 0.95em;
  color: #374151;
  line-height: 1.4;
`

const mechanismCss = css`
  padding: 0.6em;
  background: #dbeafe;
  border-radius: 0.4em;
  border-left: 3px solid #3b82f6;
`

const mechanismTitleCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: #1e40af;
  text-transform: uppercase;
  margin-bottom: 0.3em;
`

const mechanismDescCss = css`
  font-size: 0.9em;
  color: #1e3a8a;
`

const sectionCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.3em;
`

const sectionTitleCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
`

const listCss = css`
  margin: 0;
  padding-left: 1.2em;
  font-size: 0.9em;
  color: #374151;
  line-height: 1.5;
`

const victoryCss = css`
  padding: 0.6em;
  background: #fef3c7;
  border-radius: 0.4em;
  border-left: 3px solid #f59e0b;
`

const victoryTitleCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
  margin-bottom: 0.3em;
`

const victoryListCss = css`
  margin: 0;
  padding-left: 1.2em;
  font-size: 0.85em;
  color: #78350f;
  line-height: 1.5;
`
