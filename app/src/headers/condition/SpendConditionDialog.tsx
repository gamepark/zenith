/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture, useLegalMove, useLegalMoves, usePlay, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { ConditionalEffect, ConditionType, ExpandedEffect, SpendCreditEffect, SpendZenithiumEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Influence } from '@gamepark/zenith/material/Influence'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ZenithDialog } from '../../components/ZenithDialog'
import Credit from '../../images/credit/Credit1.png'
import Zenithium from '../../images/zenithium/Zenithium.png'
import { useDoConditionHeaderContext } from './condition.utils'

type Props = {
  type: 'credit' | 'zenithium'
  onMinimize: () => void
  onChosen?: () => void
}

export const SpendConditionDialog: FC<Props> = ({ type, onMinimize, onChosen }) => {
  const { t } = useTranslation()
  const isCredit = type === 'credit'
  const { conditionEffect, resultingEffect } = useDoConditionHeaderContext<SpendCreditEffect | SpendZenithiumEffect>()
  const rules = useRules<ZenithRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const play = usePlay()

  const quantities = conditionEffect.quantities
  const factors = conditionEffect.factors

  // Current resource count
  const team = new PlayerHelper(rules.game as MaterialGame, rules.getActivePlayer()!).team
  const available = isCredit
    ? rules.material(MaterialType.CreditToken).player(team).getItems().reduce((sum, item) => sum + (item.id as number), 0)
    : rules.material(MaterialType.ZenithiumToken).player(team).length

  // Reward type
  const isInfluenceReward = resultingEffect.type === EffectType.WinInfluence
  const rewardInfluence = isInfluenceReward ? (resultingEffect as { influence?: Influence }).influence : undefined

  // Max gain for influence rewards (based on disc position)
  let maxGain = Infinity
  if (isInfluenceReward && rewardInfluence) {
    const disc = rules.material(MaterialType.InfluenceDisc).id(rewardInfluence)
    const discPosition = disc.getItem()?.location.x ?? 0
    const teamColor = new PlayerHelper(rules.game as MaterialGame, rules.getActivePlayer()!).team
    maxGain = teamColor === 1 ? 4 + discPosition : 4 - discPosition
  }

  // Legal moves
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const spendMoves = useLegalMoves<CustomMove>(
    (move: MaterialMove) =>
      effect.condition.type === ConditionType.DoEffect &&
      effect.condition.effect.type === (isCredit ? EffectType.SpendCredit : EffectType.SpendZenithium) &&
      isCustomMoveType(CustomMoveType.DoCondition)(move)
  )

  const color = isCredit ? '#d4872a' : '#7c3aed'
  const icon = isCredit ? Credit : Zenithium
  const resourceName = isCredit ? t('spend-dialog.credits') : t('spend-dialog.zenithium')

  // Build options
  const options = quantities.map((quantity, i) => {
    const factor = factors[i]
    const effectiveGain = isInfluenceReward ? Math.min(factor, maxGain) : factor
    const move = spendMoves.find(m => m.data === quantity)
    const canAfford = quantity <= available
    return { quantity, factor, effectiveGain, move, canAfford }
  })

  const optionsWithUsefulness = options.map((opt, i) => {
    const bestCheaper = i > 0 ? Math.max(...options.slice(0, i).map(o => o.effectiveGain)) : 0
    return { ...opt, useful: opt.canAfford && opt.effectiveGain > bestCheaper && !!opt.move }
  })

  const getRewardLabel = (gain: number) => {
    if (resultingEffect.type === EffectType.WinInfluence) return t('spend-dialog.influence-gain', { count: gain })
    if (resultingEffect.type === EffectType.WinZenithium) return t('spend-dialog.zenithium-gain', { count: gain })
    if (resultingEffect.type === EffectType.WinCredit) return t('spend-dialog.credit-gain', { count: gain })
    return `+${gain}`
  }

  return (
    <ZenithDialog open={true} onBackdropClick={onMinimize}>
      <div css={dialogContentCss}>
        {/* Header */}
        <div css={headerBlockCss}>
          <div css={headerTextCss}>
            <span css={titleCss(color)}>
              <Picture src={icon} css={titleIconCss} /> {resourceName}
            </span>
            <span css={subtitleCss}>{t('spend-dialog.available', { count: available })}</span>
          </div>
        </div>

        {/* Options */}
        <div css={optionsCss}>
          {optionsWithUsefulness.map(({ quantity, effectiveGain, move, useful }) => (
            <div
              key={quantity}
              css={[optionCardCss(color), useful ? clickableCardCss(color) : disabledCardCss]}
              onClick={() => { if (useful && move) { play(move); onChosen ? onChosen() : onMinimize() } }}
            >
              <div css={optionHeaderCss(color)}>
                <span css={optionTitleCss}>{getRewardLabel(effectiveGain)}</span>
              </div>

              <div css={optionContentCss}>
                <div css={costSectionCss}>
                  <span css={costLabelCss}>{t('spend-dialog.cost')}</span>
                  <span css={costValueCss}>
                    {quantity} <Picture src={icon} css={costIconCss} />
                  </span>
                </div>
              </div>

              <div css={optionFooterCss}>
                {useful ? (
                  <span css={actionLabelCss(color)}>{t('spend-dialog.select')}</span>
                ) : (
                  <span css={disabledLabelCss}>
                    {!options.find(o => o.quantity === quantity)?.canAfford
                      ? t('spend-dialog.not-enough')
                      : t('spend-dialog.wasted')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pass button */}
        <div css={footerButtonsCss}>
          <button css={passButtonCss} onClick={() => { if (pass) { play(pass); onChosen ? onChosen() : onMinimize() } }}>
            {t('spend-dialog.pass')}
          </button>
        </div>
      </div>
    </ZenithDialog>
  )
}

const dialogContentCss = css`
  position: relative;
  min-width: 50em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  font-size: 1.3em;
`

const headerBlockCss = css`
  display: flex;
  align-items: center;
  gap: 1.2em;
  margin-bottom: 1.5em;
  padding-bottom: 1em;
  border-bottom: 0.15em solid rgba(0, 0, 0, 0.1);
`

const headerTextCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const titleCss = (color: string) => css`
  font-size: 2.2em;
  font-weight: 700;
  color: ${color};
  display: flex;
  align-items: center;
  gap: 0.3em;
`

const titleIconCss = css`
  height: 1em;
  img { height: 1em; vertical-align: middle; }
`

const subtitleCss = css`
  font-size: 1.2em;
  color: #666;
`

const optionsCss = css`
  display: flex;
  align-items: stretch;
  gap: 2em;
  width: 100%;
`

const optionCardCss = (color: string) => css`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 14em;
  background: white;
  border-radius: 1em;
  overflow: hidden;
  box-shadow: 0 0.2em 1em rgba(0, 0, 0, 0.1);
  border: 0.15em solid ${color}33;
  transition: all 0.2s ease;
`

const disabledCardCss = css`
  opacity: 0.5;
  cursor: not-allowed;
`

const clickableCardCss = (color: string) => css`
  cursor: pointer;

  &:hover {
    box-shadow: 0 0.3em 1.5em rgba(0, 0, 0, 0.2), 0 0 0 0.2em ${color}40;
    border-color: ${color};
  }

  &:active {
    box-shadow: 0 0.15em 0.8em rgba(0, 0, 0, 0.15);
  }
`

const optionHeaderCss = (color: string) => css`
  background: ${color};
  padding: 1em 1.5em;
  text-align: center;
`

const optionTitleCss = css`
  font-size: 1.5em;
  font-weight: 700;
  color: white;
  text-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.2);
`

const optionContentCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
`

const costSectionCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8em 1em;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 0.6em;
  border: 1px solid #fca5a5;
`

const costLabelCss = css`
  font-size: 1em;
  font-weight: 600;
  color: #991b1b;
  text-transform: uppercase;
`

const costValueCss = css`
  font-size: 1.1em;
  font-weight: 600;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.3em;
`

const costIconCss = css`
  height: 1.2em;
  img { height: 1.2em; vertical-align: middle; }
`

const optionFooterCss = css`
  padding: 1em 1.5em;
  background: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  text-align: center;
`

const actionLabelCss = (color: string) => css`
  font-size: 1.2em;
  font-weight: 600;
  color: ${color};
  text-transform: uppercase;
`

const disabledLabelCss = css`
  font-size: 1em;
  color: #999;
  font-style: italic;
`

const footerButtonsCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  margin-top: 1em;
`

const passButtonCss = css`
  padding: 0.6em 1.5em;
  border: 0.15em solid #e57373;
  border-radius: 0.5em;
  background: transparent;
  color: #c62828;
  font-size: 1.2em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ffebee;
    border-color: #c62828;
  }
`
