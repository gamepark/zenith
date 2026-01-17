/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HelpTransComponents } from '../i18n/trans.components'
import LeaderSilver from '../images/icons/leader-silver.png'

export const DiplomacyBoardHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = () => {
  const { t } = useTranslation()
  const components = { ...HelpTransComponents, badge: HelpTransComponents.leaderSilver }

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <Picture src={LeaderSilver} css={iconCss} />
        <span css={titleCss}>{t('help.diplomacy-board.title')}</span>
      </div>

      <div css={descCss}>{t('help.diplomacy-board.desc')}</div>

      <div css={effectsSectionCss}>
        <div css={effectTitleCss}>{t('help.diplomacy-board.effects')}</div>
        <div css={effectsCss}>
          <div css={effectCss}>
            <Trans i18nKey="help.diplomacy-board.effect1" components={components} />
          </div>
          <div css={effectCss}>
            <Trans i18nKey="help.diplomacy-board.effect2" components={components} />
          </div>
          <div css={effectCss}>
            <Trans i18nKey="help.diplomacy-board.effect3" components={components} />
          </div>
        </div>
      </div>

      <div css={noteCss}>{t('help.diplomacy-board.note')}</div>
    </div>
  )
}

const containerCss = css`
  min-width: 18em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const headerCss = css`
  display: flex;
  align-items: center;
  gap: 0.6em;
`

const iconCss = css`
  width: 2em;
  height: 2em;
  object-fit: contain;
`

const titleCss = css`
  font-size: 1.2em;
  font-weight: 700;
  color: #1f2937;
`

const descCss = css`
  font-size: 0.95em;
  color: #374151;
  line-height: 1.4;
`

const effectsSectionCss = css`
  padding: 0.6em;
  background: #f9fafb;
  border-radius: 0.5em;
`

const effectTitleCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.4em;
`

const effectsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.3em;
`

const effectCss = css`
  font-size: 0.95em;
  color: #374151;
  padding-left: 0.5em;
  border-left: 2px solid #d1d5db;
`

const noteCss = css`
  font-size: 0.85em;
  color: #6b7280;
  font-style: italic;
`
