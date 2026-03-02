/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import LeaderGold from '../images/icons/leader-gold.png'
import LeaderSilver from '../images/icons/leader-silver.png'

export const LeaderBadgeHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const isGold = !!item.location?.rotation

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <Picture src={isGold ? LeaderGold : LeaderSilver} css={badgeIconCss} />
        <div>
          <div css={titleCss}>{t('help.leader.title')}</div>
          <div css={subtitleCss}>{isGold ? t('help.leader.side.gold') : t('help.leader.side.silver')}</div>
        </div>
      </div>

      <div css={sectionsCss}>
        <div css={sectionCss}>
          <span css={sectionTitleCss}>{t('help.leader.hand-limit')}</span>
          <div css={progressionCss}>
            <span css={stepCss(!isGold)}>
              <Picture src={LeaderSilver} css={stepIconCss} />
              {t('help.leader.step.silver')}
            </span>
            <span css={arrowCss}>&rarr;</span>
            <span css={stepCss(isGold)}>
              <Picture src={LeaderGold} css={stepIconCss} />
              {t('help.leader.step.gold')}
            </span>
          </div>
        </div>

        <p css={descCss}>{t('help.leader.desc')}</p>
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
  color: #3e3020;
`

const subtitleCss = css`
  font-size: 0.85em;
  color: rgba(62, 48, 32, 0.5);
`

const sectionsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const sectionCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.4em;
`

const sectionTitleCss = css`
  font-size: 0.9em;
  font-weight: 600;
  color: rgba(62, 48, 32, 0.5);
  text-transform: uppercase;
`

const progressionCss = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
`

const stepCss = (active: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.3em 0.6em;
  border-radius: 0.4em;
  font-size: 0.95em;
  background: ${active ? '#fef3c7' : 'rgba(212, 135, 42, 0.08)'};
  color: ${active ? '#92400e' : '#4b5563'};
  font-weight: ${active ? 600 : 400};
`

const stepIconCss = css`
  width: 1.2em;
  height: 1.2em;
  object-fit: contain;
`

const arrowCss = css`
  color: #9ca3af;
  font-size: 1.1em;
`

const descCss = css`
  font-size: 0.9em;
  color: rgba(62, 48, 32, 0.5);
  line-height: 1.4;
  margin: 0;
`
