/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ConditionType, Effect, isDoEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HelpTransComponents } from '../i18n/trans.components'

/**
 * Shared component for displaying effect descriptions.
 * Uses the same translations as AgentCardHelp popups.
 */
export const EffectText: FC<{ effect: Effect }> = ({ effect }) => {
  const { t } = useTranslation()
  const components = { ...HelpTransComponents, badge: HelpTransComponents.leaderSilver }

  switch (effect.type) {
    case EffectType.WinCredit:
      return <Trans i18nKey="help.win-credit" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.WinInfluence: {
      const count = effect.quantity ?? 1
      if (effect.pattern) {
        if (effect.pattern.length === 2) {
          return (
            <Trans
              i18nKey="help.win-influence.pattern2"
              values={{ first: effect.pattern[0], second: effect.pattern[1] }}
              components={components}
            />
          )
        }
        return (
          <Trans
            i18nKey="help.win-influence.pattern"
            values={{ left: effect.pattern[0], center: effect.pattern[1], right: effect.pattern[2] }}
            components={components}
          />
        )
      }
      if (effect.fromCenter) {
        return <Trans i18nKey="help.win-influence.from-center" values={{ count }} components={components} />
      }
      if (effect.differentPlanet) {
        return <Trans i18nKey="help.win-influence.different" values={{ count }} components={components} />
      }
      if (effect.opponentSide) {
        return <Trans i18nKey="help.win-influence.opponent-side" values={{ count }} components={components} />
      }
      return <Trans i18nKey="help.win-influence" values={{ count }} components={components} />
    }
    case EffectType.WinZenithium:
      return <Trans i18nKey="help.win-zenithium" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.Transfer:
      return <Trans i18nKey="help.transfer" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.Mobilize:
      return <Trans i18nKey="help.mobilize.short" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.TakeLeaderBadge:
      return <Trans i18nKey="help.take-leader" components={components} />
    case EffectType.TakeTechnologyBonusToken:
      return <Trans i18nKey="help.take-tech-token" components={components} />
    case EffectType.StealCredit:
      return <Trans i18nKey="help.steal-credit" values={{ count: effect.quantity }} components={components} />
    case EffectType.ShareCard:
      return <Trans i18nKey="help.share-card" values={{ count: effect.maxQuantity }} components={components} />
    case EffectType.Exile:
      if (effect.opponent) {
        return <Trans i18nKey="help.exile.opponent" values={{ count: effect.quantity ?? 1 }} components={components} />
      }
      return <Trans i18nKey="help.exile" values={{ count: effect.quantity ?? 1 }} components={components} />
    case EffectType.Conditional: {
      const condition = effect.condition
      const doEffectCondition = isDoEffect(condition)
      const conditionEffect = doEffectCondition ? condition.effect : undefined

      return (
        <span css={conditionalInlineCss}>
          <span css={conditionLabelCss}>{effect.mandatory ? t('help.prerequisite') : t('help.if')}</span>
          <span css={conditionTextCss}>
            {condition.type === ConditionType.Leader && <Trans i18nKey="help.if-leader.short" components={components} />}
            {condition.type === ConditionType.HaveCredits && (
              <Trans i18nKey="help.if-credits.short" values={{ min: condition.min }} components={components} />
            )}
            {conditionEffect && <EffectText effect={conditionEffect} />}
          </span>
          <span css={arrowCss}>→</span>
          <EffectText effect={effect.effect} />
        </span>
      )
    }
    default:
      return null
  }
}

const conditionalInlineCss = css`
  display: inline;
`

const conditionLabelCss = css`
  color: #7c3aed;
  font-size: 0.8em;
  font-weight: 700;
  text-transform: uppercase;
  margin-right: 0.3em;
`

const conditionTextCss = css`
  color: #6b7280;
`

const arrowCss = css`
  color: #9ca3af;
  margin: 0 0.3em;
`
