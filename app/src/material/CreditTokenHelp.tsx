/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, useRules } from '@gamepark/react-game'
import { Credit } from '@gamepark/zenith/material/Credit'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HelpTransComponents } from '../i18n/trans.components'

export const CreditTokenHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const rules = useRules<ZenithRules>()
  const creditId = item.id as Credit | undefined

  // Get team info from location
  const locationTeam = item.location?.type === LocationType.TeamCredit ? (item.location.player as TeamColor) : undefined

  // Get team credits if we have a team
  let teamCredits: number | undefined
  let teamName: string | undefined
  if (locationTeam !== undefined && rules) {
    const teamPlayer = rules.players.find((p) => getTeamColor(p) === locationTeam)
    if (teamPlayer) {
      const helper = new PlayerHelper(rules.game, teamPlayer)
      teamCredits = helper.credits
      teamName = t(`team.${locationTeam}`)
    }
  }

  // Credit value based on id (1, 3, or 5)
  const creditValue = creditId !== undefined ? creditId : undefined

  return (
    <div css={containerCss}>
      <div css={headerCss}>
        <span css={titleCss}>{t('help.credit.title')}</span>
        {creditValue !== undefined && (
          <span css={valueCss}>{t('help.credit.value', { value: creditValue })}</span>
        )}
      </div>

      {teamName && teamCredits !== undefined && (
        <div css={teamInfoCss(locationTeam === TeamColor.White)}>
          <span css={teamLabelCss}>{t('help.credit.team', { team: teamName })}</span>
          <span css={teamValueCss}>{t('help.credit.total', { count: teamCredits })}</span>
        </div>
      )}

      <div css={descCss}>{t('help.credit.desc')}</div>

      <div css={sectionCss}>
        <div css={sectionTitleCss}>{t('help.credit.usage')}</div>
        <ul css={listCss}>
          <li>{t('help.credit.usage.recruit')}</li>
          <li>{t('help.credit.usage.effects')}</li>
        </ul>
      </div>

      <div css={sectionCss}>
        <div css={sectionTitleCss}>{t('help.credit.how-to-gain')}</div>
        <ul css={listCss}>
          <li>{t('help.credit.gain.effects')}</li>
          <li><Trans i18nKey="help.credit.gain.diplomacy" components={HelpTransComponents} /></li>
          <li>{t('help.credit.gain.tech')}</li>
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

const valueCss = css`
  font-size: 0.9em;
  color: #6b7280;
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
