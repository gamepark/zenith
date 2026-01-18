/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HelpTransComponents } from '../i18n/trans.components'
import LeaderGold from '../images/icons/leader-gold.png'
import LeaderSilver from '../images/icons/leader-silver.png'

export const LeaderBadgeHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const isGold = !!item.location?.rotation

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <Picture src={isGold ? LeaderGold : LeaderSilver} css={badgeIconCss} />
        <span css={titleCss}>{t('help.leader.title')}</span>
      </div>

      <div css={sectionsCss}>
        <div css={sectionCss}>
          <span css={sectionTitleCss}>{t('help.leader.hand-limit')}</span>
          <span css={sectionTextCss}>
            <Trans i18nKey="help.leader.hand-limit.desc" components={HelpTransComponents} />
          </span>
        </div>

        <div css={sideCss(isGold)}>
          <Picture src={isGold ? LeaderGold : LeaderSilver} css={sideIconCss} />
          <span>{isGold ? t('help.leader.side.gold') : t('help.leader.side.silver')}</span>
        </div>
      </div>
    </div>
  )
}

const containerCss = css`
  min-width: 18em;
  display: flex;
  flex-direction: column;
  gap: 1em;
`

const headerCss = css`
  display: flex;
  align-items: center;
  gap: 0.8em;
`

const badgeIconCss = css`
  width: 2.5em;
  height: 2.5em;
  object-fit: contain;
`

const titleCss = css`
  font-size: 1.3em;
  font-weight: 700;
  color: #1f2937;
`

const sectionsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const sectionCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const sectionTitleCss = css`
  font-size: 0.9em;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
`

const sectionTextCss = css`
  font-size: 1em;
  color: #374151;
  line-height: 1.4;
`

const sideCss = (isGold: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.6em;
  background: ${isGold ? '#fef3c7' : '#f3f4f6'};
  border-radius: 0.5em;
  font-weight: 500;
  color: ${isGold ? '#92400e' : '#4b5563'};
`

const sideIconCss = css`
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
`
