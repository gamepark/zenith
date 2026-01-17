/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { Effect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTechnologyAction } from '@gamepark/zenith/rules/discard-action/TechnologyActions'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HelpTransComponents } from '../i18n/trans.components'
import Animod from '../images/icons/animod.jpg'
import Humanoid from '../images/icons/humanoid.jpg'
import Robot from '../images/icons/robot.jpg'
import Zenithium from '../images/zenithium/Zenithium.png'

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

      <div css={levelsCss}>
        {techActions.map((effects, level) => (
          <div key={level} css={levelRowCss}>
            <div css={levelHeaderCss}>
              <span css={levelNumberCss}>{level + 1}</span>
              <div css={levelCostCss}>
                <Picture src={Zenithium} css={zenithiumIconCss} />
                <span>×{level + 1}</span>
              </div>
            </div>
            <div css={levelEffectsCss}>
              {effects.map((effect, i) => (
                <EffectText key={i} effect={effect} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const EffectText: FC<{ effect: Effect }> = ({ effect }) => {
  const { t } = useTranslation()
  const components = { ...HelpTransComponents, badge: HelpTransComponents.leaderSilver }

  switch (effect.type) {
    case EffectType.WinCredit:
      return <Trans i18nKey="help.win-credit" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.WinInfluence:
      const count = effect.quantity ?? 1
      return <Trans i18nKey="help.win-influence" values={{ count }} components={components} />
    case EffectType.WinZenithium:
      return <Trans i18nKey="help.win-zenithium" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.Transfer:
      return <Trans i18nKey="help.transfer" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.Mobilize:
      return <Trans i18nKey="help.mobilize.short" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.TakeLeaderBadge:
      return <Trans i18nKey="help.take-leader" components={components} />
    case EffectType.TakeTechnologyBonusToken:
      return <span>{t('help.take-tech-token')}</span>
    case EffectType.Conditional:
      return <EffectText effect={effect.effect} />
    default:
      return null
  }
}

const containerCss = css`
  min-width: 20em;
  display: flex;
  flex-direction: column;
  gap: 1em;
`

const headerCss = css`
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding-bottom: 0.8em;
  border-bottom: 1px solid #e5e7eb;
`

const factionIconCss = css`
  width: 3em;
  height: 3em;
  border-radius: 50%;
  object-fit: cover;
`

const headerTextCss = css`
  display: flex;
  flex-direction: column;
`

const titleCss = css`
  font-size: 1.2em;
  font-weight: 700;
  color: #1f2937;
`

const subtitleCss = css`
  font-size: 0.95em;
  color: #6b7280;
`

const levelsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.6em;
`

const levelRowCss = css`
  display: flex;
  align-items: flex-start;
  gap: 1em;
  padding: 0.6em;
  background: #f9fafb;
  border-radius: 0.5em;
`

const levelHeaderCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3em;
  min-width: 3em;
`

const levelNumberCss = css`
  font-size: 1.4em;
  font-weight: 700;
  color: #4b5563;
`

const levelCostCss = css`
  display: flex;
  align-items: center;
  gap: 0.2em;
  font-size: 0.85em;
  color: #9ca3af;
`

const zenithiumIconCss = css`
  width: 1.2em;
  height: 1.2em;
`

const levelEffectsCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  font-size: 0.95em;
  color: #374151;
`
