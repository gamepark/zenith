/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture } from '@gamepark/react-game'
import { ConditionType, Effect, isDoEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Faction } from '@gamepark/zenith/material/Faction'
import { Influence } from '@gamepark/zenith/material/Influence'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { helpCss, HelpTransComponents } from '../i18n/trans.components'
import Animod from '../images/icons/animod.jpg'
import Humanoid from '../images/icons/humanoid.jpg'
import Robot from '../images/icons/robot.jpg'
import Mercury from '../images/planet/Mercury.png'
import Venus from '../images/planet/Venus.png'
import Terra from '../images/planet/Terra.png'
import Mars from '../images/planet/Mars.png'
import Jupiter from '../images/planet/Jupiter.png'

const planetImages: Record<Influence, string> = {
  [Influence.Mercury]: Mercury,
  [Influence.Venus]: Venus,
  [Influence.Terra]: Terra,
  [Influence.Mars]: Mars,
  [Influence.Jupiter]: Jupiter
}

const factionImages: Record<Faction, string> = {
  [Faction.Animod]: Animod,
  [Faction.Human]: Humanoid,
  [Faction.Robot]: Robot
}

export const getPlanetIcon = (influence: Influence) => <Picture src={planetImages[influence]} css={helpCss()} />
export const getFactionIcon = (faction: Faction) => <Picture src={factionImages[faction]} css={helpCss(true)} />

/**
 * Shared component for displaying effect descriptions.
 * Used by AgentCardHelp, TechnologyBoardHelp, and DiscardActionDialog.
 */
export const EffectText: FC<{ effect: Effect; sameColor?: boolean; factors?: number[] }> = ({ effect, sameColor, factors }) => {
  const { t } = useTranslation()
  const components = HelpTransComponents

  const countValue = (defaultCount: number) => (factors ? factors.join('/') : defaultCount)

  switch (effect.type) {
    case EffectType.WinInfluence: {
      const count = countValue(effect.quantity ?? 1)
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
        return <Trans i18nKey="help.win-influence.from-center" values={{ count }} components={components} shouldUnescape={!!factors} />
      }
      if (effect.differentPlanet) {
        return <Trans i18nKey="help.win-influence.different" values={{ count }} components={components} shouldUnescape={!!factors} />
      }
      if (effect.opponentSide) {
        return <Trans i18nKey="help.win-influence.opponent-side" values={{ count }} components={components} shouldUnescape={!!factors} />
      }
      if (effect.except !== undefined) {
        return (
          <Trans
            i18nKey="help.win-influence.except"
            values={{ count }}
            components={{ ...components, planet: getPlanetIcon(effect.except) }}
            shouldUnescape={!!factors}
          />
        )
      }
      if (effect.influence !== undefined) {
        return (
          <Trans
            i18nKey="help.win-influence.planet"
            values={{ count }}
            components={{ ...components, planet: getPlanetIcon(effect.influence) }}
            shouldUnescape={!!factors}
          />
        )
      }
      if (sameColor) {
        return (
          <span css={sameColorCss}>
            <Trans i18nKey="help.win-influence" values={{ count }} components={components} shouldUnescape={!!factors} /> (= même couleur)
          </span>
        )
      }
      return (
        <>
          <Trans i18nKey="help.win-influence" values={{ count }} components={components} shouldUnescape={!!factors} />{' '}
          <span css={noteCss}>({t('help.choice')})</span>
        </>
      )
    }

    case EffectType.WinCredit: {
      const count = effect.quantity ?? 1
      if (effect.opponent) {
        return <Trans i18nKey="help.win-credit.for-opponent" values={{ count }} components={components} />
      }
      if (effect.factorPerDifferentInfluence) {
        return <Trans i18nKey="help.win-credit.per-planet" values={{ count: effect.factorPerDifferentInfluence }} components={components} />
      }
      if (effect.factorPerDifferentOpponentInfluence) {
        return <Trans i18nKey="help.win-credit.per-opponent-planet" values={{ count: effect.factorPerDifferentOpponentInfluence }} components={components} />
      }
      if (effect.perLevel1Technology) {
        return (
          <Trans
            i18nKey="help.win-credit.per-tech"
            values={{ levels: effect.perLevel1Technology.join('/') }}
            components={components}
            shouldUnescape
          />
        )
      }
      return <Trans i18nKey="help.win-credit" values={{ count }} components={components} />
    }

    case EffectType.WinZenithium: {
      const count = effect.quantity ?? 1
      if (effect.opponent) {
        return <Trans i18nKey="help.win-zenithium.for-opponent" values={{ count }} components={components} />
      }
      if (effect.perLevel1Technology) {
        return (
          <Trans
            i18nKey="help.win-zenithium.per-tech"
            values={{ levels: effect.perLevel1Technology.join('/') }}
            components={components}
            shouldUnescape
          />
        )
      }
      return <Trans i18nKey="help.win-zenithium" values={{ count }} components={components} />
    }

    case EffectType.Discard:
      if (effect.full) {
        return <>{t('help.discard-all')}</>
      }
      return <Trans i18nKey="help.discard" values={{ count: 1 }} components={components} />

    case EffectType.Transfer: {
      const count = effect.quantity ?? 1
      if (effect.influence !== undefined) {
        return <Trans i18nKey="help.transfer.planet" values={{ count }} components={{ ...components, planet: getPlanetIcon(effect.influence) }} />
      }
      return (
        <>
          <Trans i18nKey="help.transfer" values={{ count }} components={components} /> <span css={noteCss}>({t('help.choice')})</span>
        </>
      )
    }

    case EffectType.Exile: {
      const count = effect.quantity ?? 1
      if (effect.quantities && effect.factors && effect.influence !== undefined) {
        return (
          <Trans
            i18nKey="help.exile.scale"
            values={{ quantities: effect.quantities.join('/'), factors: effect.factors.join('/') }}
            components={{ ...components, planet: getPlanetIcon(effect.influence) }}
            shouldUnescape
          />
        )
      }
      if (effect.opponent) {
        return <Trans i18nKey="help.exile.from-opponent" defaults="Exile {count, plural, one{# card} other{# cards}} from the opposing team" values={{ count }} components={components} />
      }
      if (effect.except !== undefined) {
        return <Trans i18nKey="help.exile.except" values={{ count }} components={{ ...components, planet: getPlanetIcon(effect.except) }} />
      }
      if (effect.influence !== undefined) {
        return <Trans i18nKey="help.exile.planet" values={{ count }} components={{ ...components, planet: getPlanetIcon(effect.influence) }} />
      }
      return (
        <>
          <Trans i18nKey="help.exile" values={{ count }} components={components} /> <span css={noteCss}>({t('help.choice')})</span>
        </>
      )
    }

    case EffectType.Mobilize:
      return <Trans i18nKey="help.mobilize" values={{ count: effect.quantity ?? 1 }} components={components} />

    case EffectType.TakeLeaderBadge:
      if (effect.gold) {
        return <Trans i18nKey="help.take-leader.gold" components={{ ...components, badge: HelpTransComponents.leaderGold }} />
      }
      return <Trans i18nKey="help.take-leader" components={components} />

    case EffectType.GiveLeaderBadge:
      return <Trans i18nKey="help.give-leader" components={components} />

    case EffectType.DevelopTechnology: {
      if (effect.free && effect.lowest) {
        return (
          <>
            {t('help.develop')} {t('help.develop.free')}
          </>
        )
      }
      if (effect.faction && effect.discount) {
        return (
          <>
            <Trans i18nKey="help.develop.faction" components={{ ...components, faction: getFactionIcon(effect.faction) }} />{' '}
            <span css={bonusCss}>
              <Trans i18nKey="help.develop.discount" values={{ discount: effect.discount }} components={components} />
            </span>
          </>
        )
      }
      if (effect.discount) {
        return (
          <>
            {t('help.develop')}{' '}
            <span css={bonusCss}>
              <Trans i18nKey="help.develop.discount" values={{ discount: effect.discount }} components={components} />
            </span>
          </>
        )
      }
      if (effect.faction) {
        return <Trans i18nKey="help.develop.faction" components={{ ...components, faction: getFactionIcon(effect.faction) }} />
      }
      return <>{t('help.develop')}</>
    }

    case EffectType.GiveCredit:
      return <Trans i18nKey="help.give-credit" values={{ count: effect.quantity }} components={components} />

    case EffectType.GiveZenithium:
      return <Trans i18nKey="help.give-zenithium" values={{ count: effect.quantity ?? 1 }} components={components} />

    case EffectType.GiveInfluence:
      if (effect.except !== undefined) {
        return <Trans i18nKey="help.give-influence.except" values={{ count: 1 }} components={{ ...components, planet: getPlanetIcon(effect.except) }} />
      }
      return (
        <>
          <Trans i18nKey="help.give-influence" values={{ count: 1 }} components={components} /> <span css={noteCss}>({t('help.choice')})</span>
        </>
      )

    case EffectType.ResetInfluence:
      return <>{t('help.reset-influence')}</>

    case EffectType.TakeBonus:
      if (effect.visible) {
        return <Trans i18nKey="help.take-bonus.visible" components={components} />
      }
      return <Trans i18nKey="help.take-bonus" components={components} />

    case EffectType.SpendCredit:
      if (effect.quantities && effect.factors) {
        return (
          <Trans
            i18nKey="help.spend-credit"
            values={{ quantities: effect.quantities.join('/'), factors: effect.factors.join('/') }}
            components={components}
            shouldUnescape
          />
        )
      }
      return null

    case EffectType.SpendZenithium:
      if (effect.quantities && effect.factors) {
        return (
          <Trans
            i18nKey="help.spend-zenithium"
            values={{ quantities: effect.quantities.join('/'), factors: effect.factors.join('/') }}
            components={components}
            shouldUnescape
          />
        )
      }
      return null

    case EffectType.StealCredit:
      return <Trans i18nKey="help.steal-credit" values={{ count: effect.quantity }} components={components} />

    case EffectType.StealZenithium:
      return <Trans i18nKey="help.steal-zenithium" values={{ count: effect.quantity }} components={components} />

    case EffectType.TakeTechnologyBonusToken:
      return <Trans i18nKey="help.take-tech-token" components={components} />

    case EffectType.ShareCard:
      return <Trans i18nKey="help.share-card" values={{ count: effect.maxQuantity }} components={components} />

    case EffectType.Conditional: {
      const condition = effect.condition
      const doEffectCondition = isDoEffect(condition)
      const conditionEffect = doEffectCondition ? condition.effect : undefined
      const conditionFactors =
        conditionEffect?.type === EffectType.SpendCredit ||
        conditionEffect?.type === EffectType.SpendZenithium ||
        conditionEffect?.type === EffectType.Exile
          ? conditionEffect.factors
          : undefined

      // Special case: DoEffect(Exile { opponent }) → WinCredit without quantity
      const isExileForCost =
        conditionEffect?.type === EffectType.Exile &&
        conditionEffect.opponent &&
        effect.effect.type === EffectType.WinCredit &&
        !effect.effect.quantity

      if (isExileForCost) {
        return (
          <Trans
            i18nKey="help.exile.from-opponent.for-cost"
            defaults="Exile {count, plural, one{# card} other{# cards}} from the opposing team and gain <credit/> equal to its cost"
            values={{ count: conditionEffect.quantity ?? 1 }}
            components={components}
          />
        )
      }

      // Special case: DoEffect(Transfer) → WinCredit without quantity
      const isTransferForCost =
        conditionEffect?.type === EffectType.Transfer &&
        effect.effect.type === EffectType.WinCredit &&
        !effect.effect.quantity

      if (isTransferForCost) {
        return (
          <Trans
            i18nKey="help.transfer.for-cost"
            defaults="Transfer {count, plural, one{# card} other{# cards}} and gain <credit/> equal to its cost"
            values={{ count: conditionEffect.quantity ?? 1 }}
            components={components}
          />
        )
      }

      return (
        <div css={conditionalContainerCss}>
          <div css={conditionBlockCss}>
            <div css={conditionHeaderCss}>{t('help.if')}</div>
            <div css={conditionContentCss}>
              {condition.type === ConditionType.Leader && <Trans i18nKey="help.if-leader.short" components={components} />}
              {condition.type === ConditionType.HaveCredits && (
                <Trans i18nKey="help.if-credits.short" values={{ min: condition.min }} components={components} />
              )}
              {conditionEffect && <EffectText effect={conditionEffect} />}
            </div>
          </div>
          <div css={conditionalArrowCss}>↓</div>
          <div css={resultBlockCss}>
            <div css={resultHeaderCss}>{t('help.then')}</div>
            <div css={resultContentCss}>
              <EffectText effect={effect.effect} sameColor={doEffectCondition} factors={conditionFactors} />
            </div>
          </div>
        </div>
      )
    }

    case EffectType.Choice:
      return (
        <span css={choiceContainerCss}>
          <EffectText effect={effect.left} />
          <span css={choiceOrCss}>{t('help.or')}</span>
          <EffectText effect={effect.right} />
        </span>
      )

    default:
      return null
  }
}

const noteCss = css`
  color: rgba(62, 48, 32, 0.5);
  font-style: italic;
  font-size: 0.9em;
`

const sameColorCss = css`
  color: #7c3aed;
  font-weight: 600;
  font-size: 0.95em;
`

const bonusCss = css`
  color: #059669;
  font-weight: 500;
  font-size: 0.9em;
  background: #d1fae5;
  padding: 0.1em 0.4em;
  border-radius: 0.25em;
  margin-left: 0.25em;
`

const conditionalContainerCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  width: 100%;
`

const conditionBlockCss = css`
  border-radius: 0.3em;
  overflow: hidden;
  border: 0.06em solid #c4b5fd;
`

const conditionHeaderCss = css`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  font-weight: 700;
  font-size: 0.7em;
  padding: 0.2em 0.5em;
  letter-spacing: 0.05em;
`

const conditionContentCss = css`
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  padding: 0.4em 0.5em;
  font-size: 0.95em;
`

const conditionalArrowCss = css`
  color: #7c3aed;
  font-weight: 700;
  font-size: 1em;
  text-align: center;
  line-height: 1;
`

const resultBlockCss = css`
  border-radius: 0.3em;
  overflow: hidden;
  border: 0.06em solid #86efac;
`

const resultHeaderCss = css`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  font-weight: 700;
  font-size: 0.7em;
  padding: 0.2em 0.5em;
  letter-spacing: 0.05em;
`

const resultContentCss = css`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 0.4em 0.5em;
  font-size: 0.95em;
`

const choiceContainerCss = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
`

const choiceOrCss = css`
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  padding: 0.2em 0.75em;
  border-radius: 0.6em;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`
