/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getDiplomacyActions } from '@gamepark/zenith/rules/discard-action/DiplomacyActions'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { EffectText, getFactionIcon } from '../components/EffectText'
import LeaderSilver from '../images/icons/leader-silver.png'

const factions = [Faction.Robot, Faction.Human, Faction.Animod]

export const DiplomacyBoardHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()!
  const playerCount = rules.players.length
  const actions = getDiplomacyActions(playerCount)

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <Picture src={LeaderSilver} css={iconCss} />
        <span css={titleCss}>{t('help.diplomacy-board.title')}</span>
      </div>

      <div css={descCss}>{t('help.diplomacy-board.desc')}</div>

      <div css={factionsCss}>
        {factions.map(faction => (
          <div key={faction} css={factionSectionCss}>
            <div css={factionHeaderCss}>
              {getFactionIcon(faction)}
              <span>{t(`faction.${faction}`)}</span>
            </div>
            <div css={effectsCss}>
              {actions[faction].map((effect, i) => (
                <div key={i} css={effectCss}>
                  <span css={bulletCss}>•</span>
                  <EffectText effect={effect} />
                </div>
              ))}
            </div>
          </div>
        ))}
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
  color: #3e3020;
`

const descCss = css`
  font-size: 0.95em;
  color: #3e3020;
  line-height: 1.4;
`

const factionsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.6em;
`

const factionSectionCss = css`
  padding: 0.6em;
  background: rgba(212, 135, 42, 0.05);
  border-radius: 0.5em;
`

const factionHeaderCss = css`
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-size: 0.9em;
  font-weight: 600;
  color: #3e3020;
  margin-bottom: 0.4em;
`

const effectsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const effectCss = css`
  display: flex;
  align-items: baseline;
  gap: 0.3em;
  font-size: 0.9em;
  color: #3e3020;
  padding-left: 0.3em;
`

const bulletCss = css`
  color: #d4872a;
`

const noteCss = css`
  font-size: 0.85em;
  color: rgba(62, 48, 32, 0.5);
  font-style: italic;
`
