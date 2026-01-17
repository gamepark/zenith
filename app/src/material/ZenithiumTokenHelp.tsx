/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, useRules } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HelpTransComponents } from '../i18n/trans.components'

export const ZenithiumTokenHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const rules = useRules<ZenithRules>()

  // Get team info from location
  const locationTeam = item.location?.type === LocationType.TeamZenithium ? (item.location.player as TeamColor) : undefined

  // Get team zenithium if we have a team
  let teamZenithium: number | undefined
  let teamName: string | undefined
  if (locationTeam !== undefined && rules) {
    const teamPlayer = rules.players.find((p) => getTeamColor(p) === locationTeam)
    if (teamPlayer) {
      const helper = new PlayerHelper(rules.game, teamPlayer)
      teamZenithium = helper.zenithium
      teamName = t(`team.${locationTeam}`)
    }
  }

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <span css={titleCss}>{t('help.zenithium.title')}</span>
      </div>

      {teamName && teamZenithium !== undefined && (
        <div css={teamInfoCss(locationTeam === TeamColor.White)}>
          <span css={teamLabelCss}>{t('help.zenithium.team', { team: teamName })}</span>
          <span css={teamValueCss}>{teamZenithium}</span>
        </div>
      )}

      <div css={descCss}>{t('help.zenithium.desc')}</div>

      <div css={usageSectionCss}>
        <div css={usageTitleCss}>{t('help.zenithium.usage')}</div>
        <ul css={usageListCss}>
          <li>{t('help.zenithium.usage.tech')}</li>
        </ul>
      </div>

      <div css={sectionCss}>
        <div css={sectionTitleCss}>{t('help.zenithium.how-to-gain')}</div>
        <ul css={listCss}>
          <li>{t('help.zenithium.gain.effects')}</li>
          <li><Trans i18nKey="help.zenithium.gain.diplomacy" components={HelpTransComponents} /></li>
          <li>{t('help.zenithium.gain.tech')}</li>
        </ul>
      </div>
    </div>
  )
}

const containerCss = css`
  min-width: 15em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const headerCss = css`
  display: flex;
  align-items: center;
  gap: 0.6em;
`

const titleCss = css`
  font-size: 1.2em;
  font-weight: 700;
  color: #1f2937;
`

const teamInfoCss = (isWhite: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 0.7em;
  background: ${isWhite ? '#f3f4f6' : '#374151'};
  border-radius: 0.4em;
  color: ${isWhite ? '#1f2937' : '#f3f4f6'};
`

const teamLabelCss = css`
  font-size: 0.9em;
  font-weight: 500;
`

const teamValueCss = css`
  font-size: 1.1em;
  font-weight: 700;
`

const descCss = css`
  font-size: 0.95em;
  color: #374151;
  line-height: 1.4;
`

const usageSectionCss = css`
  padding: 0.6em;
  background: #fef3c7;
  border-radius: 0.5em;
`

const usageTitleCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
  margin-bottom: 0.3em;
`

const usageListCss = css`
  margin: 0;
  padding-left: 1.2em;
  font-size: 0.9em;
  color: #78350f;
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
