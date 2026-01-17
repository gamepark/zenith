/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HelpTransComponents } from '../i18n/trans.components'

export const BonusTokenHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const { t } = useTranslation()
  const bonusId = item.id as Bonus
  const components = { ...HelpTransComponents, badge: HelpTransComponents.leaderSilver }

  const getBonusDescription = () => {
    switch (bonusId) {
      case Bonus.Exile2OpponentCards:
        return <Trans i18nKey="help.bonus.exile2" components={components} />
      case Bonus.Mobilize2:
        return <Trans i18nKey="help.bonus.mobilize2" components={components} />
      case Bonus.TakeLeaderBadge:
        return <Trans i18nKey="help.bonus.leader" components={components} />
      case Bonus.Transfer:
        return <Trans i18nKey="help.bonus.transfer" components={components} />
      case Bonus.Win1Zenithium:
        return <Trans i18nKey="help.bonus.zenithium" components={components} />
      case Bonus.Win3Credits:
        return <Trans i18nKey="help.bonus.credits3" components={components} />
      case Bonus.Win4Credits:
        return <Trans i18nKey="help.bonus.credits4" components={components} />
      case Bonus.WinInfluence:
        return <Trans i18nKey="help.bonus.influence" components={components} />
      default:
        return null
    }
  }

  return (
    <div css={containerCss}>
      <div css={titleCss}>{t('help.bonus.title')}</div>
      <div css={descriptionCss}>
        {getBonusDescription()}
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
