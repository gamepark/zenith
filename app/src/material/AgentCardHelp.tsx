/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture, useGame, usePlayerId } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { Agent } from '@gamepark/zenith/material/Agent'
import { Agents } from '@gamepark/zenith/material/Agents'
import { ConditionType, Effect, isDoEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Faction } from '@gamepark/zenith/material/Faction'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { InfluenceHelper } from '@gamepark/zenith/rules/helper/InfluenceHelper'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getColorForInfluence, helpCss, HelpTransComponents } from '../i18n/trans.components'
import Credit from '../images/credit/Credit1.png'
import Animod from '../images/icons/animod.jpg'
import Humanoid from '../images/icons/humanoid.jpg'
import Robot from '../images/icons/robot.jpg'
import Jupiter from '../images/planet/Jupiter.png'
import Mars from '../images/planet/Mars.png'
import Mercury from '../images/planet/Mercury.png'
import Terra from '../images/planet/Terra.png'
import Venus from '../images/planet/Venus.png'

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

const getPlanetIcon = (influence: Influence) => {
  return <Picture src={planetImages[influence]} css={helpCss()} />
}

const getFactionIcon = (faction: Faction) => {
  return <Picture src={factionImages[faction]} css={helpCss(true)} />
}

const EffectText: FC<{ effect: Effect; sameColor?: boolean; factors?: number[] }> = ({ effect, sameColor, factors }) => {
  const { t } = useTranslation()

  const components = {
    ...HelpTransComponents,
    badge: HelpTransComponents.leaderSilver
  }

  // Si factors est fourni, on affiche "1/2/3" au lieu de count
  const countValue = (defaultCount: number) => (factors ? factors.join('/') : defaultCount)

  switch (effect.type) {
    case EffectType.WinInfluence: {
      const count = countValue(effect.quantity ?? 1)
      if (effect.differentPlanet) {
        return <Trans i18nKey="help.win-influence.different" values={{ count }} components={components} shouldUnescape={!!factors} />
      }
      if (effect.opponentSide) {
        return <Trans i18nKey="help.win-influence.opponent-side" values={{ count }} components={components} shouldUnescape={!!factors} />
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
            components={{
              ...components,
              levels: <span>{effect.perLevel1Technology.join('/')}</span>
            }}
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
        return <Trans i18nKey="help.exile.opponent" values={{ count }} components={components} />
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

    case EffectType.Conditional: {
      const condition = effect.condition
      const doEffectCondition = isDoEffect(condition)
      const conditionEffect = doEffectCondition ? condition.effect : undefined
      const factors =
        conditionEffect?.type === EffectType.SpendCredit ||
        conditionEffect?.type === EffectType.SpendZenithium ||
        conditionEffect?.type === EffectType.Exile
          ? conditionEffect.factors
          : undefined
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
              <EffectText effect={effect.effect} sameColor={doEffectCondition} factors={factors} />
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
      return <>{effect.type}</>
  }
}

export const AgentCardHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item }) => {
  const agentId = item.id as Agent
  return <AgentCardHelpContent agentId={agentId} item={item} />
}

type AgentCardHelpContentProps = {
  agentId: Agent
  compact?: boolean
  item?: { location?: { type?: number; player?: PlayerId } }
}

export const AgentCardHelpContent: FC<AgentCardHelpContentProps> = ({ agentId, compact = false, item }) => {
  const { t } = useTranslation()
  const game = useGame<MaterialGame>()
  const playerId = usePlayerId<PlayerId>()
  const agentData = Agents[agentId]

  // Calculate real cost only if card is in player's hand
  const isInHand = item?.location?.type === LocationType.PlayerHand && item?.location?.player === playerId
  const realCost =
    isInHand && game && playerId ? new InfluenceHelper(game, getTeamColor(playerId)).getCost({ id: agentId } as any) : null

  // Mode compact : juste les effets
  if (compact) {
    const influenceColor = getColorForInfluence(agentData.influence)
    return (
      <div css={compactContainerCss}>
        <div css={compactHeaderCss} style={{ background: influenceColor }}>
          {t(`agent.${agentId}`)}
        </div>
        <div css={compactContentCss}>
          {agentData.effects.map((effect, i) => (
            <div key={i} css={compactEffectRowCss}>
              <span css={bulletCss} style={{ color: influenceColor }}>
                •
              </span>
              <span css={effectTextCss}>
                <EffectText effect={effect} />
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div css={containerCss}>
      {/* Section IDENTITÉ avec nom */}
      <div css={sectionCss}>
        <div css={[sectionHeaderCss, blueHeaderCss]}>
          <span css={sectionIconCss}>👤</span>
          {t(`agent.${agentId}`)}
        </div>
        <div css={sectionContentCss}>
          <div css={identityGridCss}>
            <div css={identityItemCss}>
              <span css={identityLabelCss}>{t('help.faction')}</span>
              <div css={identityValueCss}>
                <Picture src={factionImages[agentData.faction]} css={helpCss(true)} />
                <span>{t(`faction.${agentData.faction}`)}</span>
              </div>
            </div>
            <div css={identityItemCss}>
              <span css={identityLabelCss}>{t('help.planet')}</span>
              <div css={identityValueCss}>
                <Picture src={planetImages[agentData.influence]} css={helpCss()} />
                <span>{t(`planet.${agentData.influence}`)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section COÛT */}
      <div css={costSectionCss}>
        <span css={costLabelCss}>{t('help.cost')}</span>
        {realCost !== null && realCost !== agentData.cost ? (
          <>
            <span css={costNumberStrikeCss}>{agentData.cost}</span>
            <span css={costArrowCss}>→</span>
            <span css={costNumberCss}>{realCost}</span>
          </>
        ) : (
          <span css={costNumberCss}>{agentData.cost}</span>
        )}
        <Picture src={Credit} css={helpCss()} />
        {realCost === null && (
          <span css={costDiscountCss}>
            (<Trans i18nKey="help.cost.reduction" components={{ planet: getPlanetIcon(agentData.influence) }} />)
          </span>
        )}
      </div>

      {/* Section EFFETS */}
      <div css={sectionCss}>
        <div css={[sectionHeaderCss, orangeHeaderCss]}>
          <span css={sectionIconCss}>✦</span>
          {t('help.effects').toUpperCase()}
        </div>
        <div css={sectionContentCss}>
          {agentData.effects.map((effect, i) => (
            <div key={i} css={effectRowCss}>
              <span css={bulletCss}>•</span>
              <span css={effectTextCss}>
                <EffectText effect={effect} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const containerCss = css`
  min-width: 24em;
  margin-right: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
`

const sectionCss = css`
  border-radius: 0.3em;
  overflow: hidden;
  filter: drop-shadow(0 0.04em 0.2em rgba(0, 0, 0, 0.08));
  border: 1px solid rgba(0, 0, 0, 0.08);
`

const sectionHeaderCss = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.3em 0.5em;
  font-size: 0.85em;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: white;
  text-shadow: 0 0.03em 0.05em rgba(0, 0, 0, 0.2);
`

const blueHeaderCss = css`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
`

const orangeHeaderCss = css`
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
`

const sectionIconCss = css`
  font-size: 1.1em;
`

const sectionContentCss = css`
  padding: 0.5em;
  background: white;
`

const identityGridCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5em;
`

const identityItemCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25em;
  padding: 0.4em;
  background: #f8fafc;
  border-radius: 0.3em;
  border: 1px solid #e2e8f0;
`

const identityLabelCss = css`
  font-size: 0.75em;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

const identityValueCss = css`
  display: flex;
  align-items: center;
  gap: 0.25em;
  font-weight: 600;
  color: #1e293b;
  font-size: 1.05em;
`

const costSectionCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.3em;
  padding: 0.4em 0.5em;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.3em;
  border: 1px solid #f59e0b;
`

const costDiscountCss = css`
  font-size: 0.8em;
  color: #92400e;
  font-style: italic;
`

const costLabelCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
`

const costNumberCss = css`
  font-size: 1.5em;
  font-weight: 700;
  color: #b45309;
`

const costNumberStrikeCss = css`
  font-size: 1.2em;
  font-weight: 600;
  color: #92400e;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: -2px;
    right: -2px;
    top: 50%;
    height: 2px;
    background: #dc2626;
    transform: rotate(-15deg);
  }
`

const costArrowCss = css`
  font-size: 1em;
  color: #059669;
  font-weight: 700;
`

const effectRowCss = css`
  display: flex;
  align-items: baseline;
  gap: 0.3em;
  padding: 0.3em 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
  }
`

const bulletCss = css`
  color: #f39c12;
  font-size: 1em;
  line-height: 1;
`

const effectTextCss = css`
  flex: 1;
  line-height: 1.7;
  color: #374151;
  font-size: 1em;
`

const noteCss = css`
  color: #6b7280;
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
  border: 1px solid #c4b5fd;
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
  border: 1px solid #86efac;
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

// Compact mode styles
const compactContainerCss = css`
  width: 380px;
  background: white;
  font-size: 14px;
`

const compactHeaderCss = css`
  color: white;
  font-weight: 700;
  padding: 0.4em 0.7em;
  text-shadow: 0 0.07em 0.14em rgba(0, 0, 0, 0.3);
`

const compactContentCss = css`
  padding: 0.4em 0.6em;
`

const compactEffectRowCss = css`
  display: flex;
  align-items: baseline;
  gap: 0.3em;
  padding: 0.2em 0;
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`
