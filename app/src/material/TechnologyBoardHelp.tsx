/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTechnologyAction } from '@gamepark/zenith/rules/discard-action/TechnologyActions'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { EffectText } from '../components/EffectText'
import { HelpTransComponents } from '../i18n/trans.components'
import Animod from '../images/icons/animod.jpg'
import Humanoid from '../images/icons/humanoid.jpg'
import Robot from '../images/icons/robot.jpg'

const factionImages: Record<Faction, string> = {
  [Faction.Animod]: Animod,
  [Faction.Human]: Humanoid,
  [Faction.Robot]: Robot
}

const boardToFaction: Record<string, Faction> = {
  'D': Faction.Animod,
  'N': Faction.Animod,
  'O': Faction.Human,
  'U': Faction.Human,
  'P': Faction.Robot,
  'S': Faction.Robot
}

export const TechnologyBoardHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const boardId = item.id as string
  const faction = boardToFaction[boardId]
  const techActions = getTechnologyAction(boardId)

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <Picture src={factionImages[faction]} css={factionIconCss} />
        <div css={headerTextCss}>
          <span css={titleCss}>{t('help.technology.title')}</span>
          <span css={subtitleCss}>{t(`faction.${faction}`)}</span>
        </div>
      </div>

      <p css={descCss}>{t('help.technology.desc')}</p>
      <p css={howCss}>
        <Trans i18nKey="help.technology.how" components={HelpTransComponents} />
      </p>

      <div css={sectionTitleCss}>{t('help.technology.levels')}</div>
      <div css={levelsCss}>
        {[...techActions].reverse().map((effects, i) => {
          const level = techActions.length - i
          return (
            <div key={level} css={levelRowCss}>
              <div css={levelHeaderCss}>
                <span css={levelNumberCss} title={t('help.technology.level', { level })}>
                  {level}
                </span>
                <span css={levelCostCss}>
                  <Trans i18nKey="help.technology.cost.value" values={{ count: level }} components={HelpTransComponents} />
                </span>
              </div>
              <div css={levelEffectsCss}>
                {effects.map((effect, j) => (
                  <span key={j} css={effectTextCss}>
                    <EffectText effect={effect} />
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const containerCss = css`
  min-width: 18em;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  font-size: 0.9em;
`

const headerCss = css`
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #e5e7eb;
`

const factionIconCss = css`
  width: 2.2em;
  height: 2.2em;
  border-radius: 50%;
  object-fit: cover;
`

const headerTextCss = css`
  display: flex;
  flex-direction: column;
`

const titleCss = css`
  font-size: 1.1em;
  font-weight: 700;
  color: #1f2937;
`

const subtitleCss = css`
  font-size: 0.9em;
  color: #6b7280;
`

const descCss = css`
  margin: 0;
  font-size: 0.95em;
  color: #4b5563;
  line-height: 1.4;
`

const howCss = css`
  margin: 0;
  font-size: 0.9em;
  color: #6b7280;
  font-style: italic;
  line-height: 1.4;
`

const sectionTitleCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.3em;
`

const levelsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.4em;
`

const levelRowCss = css`
  display: flex;
  align-items: flex-start;
  gap: 0.7em;
  padding: 0.4em;
  background: #f9fafb;
  border-radius: 0.4em;
`

const levelHeaderCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
  min-width: 2.5em;
`

const levelNumberCss = css`
  font-size: 1.6em;
  font-weight: 700;
  color: #4b5563;
  cursor: help;
`

const levelCostCss = css`
  font-size: 0.8em;
  line-height: 1.5;
`

const levelEffectsCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  font-size: 0.9em;
  color: #374151;
`

const effectTextCss = css`
  line-height: 1.7;
`
