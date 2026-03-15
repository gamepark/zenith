/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture, useLegalMove, useLegalMoves, usePlay, useRules, useUndo } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemTypeAtOnce, MaterialGame, MaterialMove, MoveItemsAtOnce } from '@gamepark/rules-api'
import { Agent } from '@gamepark/zenith/material/Agent'
import { ExileEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ZenithDialog } from '../../components/ZenithDialog'
import { getColorForInfluence } from '../../i18n/trans.components'
import { agentCardDescription } from '../../material/AgentCardDescription'
import { useDoConditionHeaderContext } from './condition.utils'

type Props = {
  onMinimize: () => void
  onChosen?: () => void
}

export const ExileAtOnceConditionDialog: FC<Props> = ({ onMinimize, onChosen }) => {
  const { t } = useTranslation()
  const { conditionEffect, resultingEffect } = useDoConditionHeaderContext<ExileEffect>()
  const rules = useRules<ZenithRules>()!
  const play = usePlay()

  const influence = conditionEffect.influence
  const quantities = conditionEffect.quantities!
  const factors = conditionEffect.factors!
  const color = getColorForInfluence(influence) ?? '#70658e'

  // Cards in the influence column
  const team = new PlayerHelper(rules.game as MaterialGame, rules.getActivePlayer()!).team
  const influenceCards = rules.material(MaterialType.AgentCard)
    .location(LocationType.Influence)
    .locationId(influence)
    .player(team)
    .sort(item => -item.location.x!)
  const availableCount = influenceCards.length

  const isZenithiumReward = resultingEffect.type === EffectType.WinZenithium

  // Max gain based on disc position on the tug-of-war track (only for influence rewards)
  const disc = rules.material(MaterialType.InfluenceDisc)
    .location(LocationType.PlanetBoardInfluenceDiscSpace)
    .id(influence)
  const discPosition = disc.getItem()?.location.x ?? 0
  const maxGain = team === TeamColor.Black ? 4 + discPosition : 4 - discPosition

  // Undo
  const [undo, canUndo] = useUndo()
  const canUndoMove = canUndo()

  // Legal moves
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const exileMoves = useLegalMoves<MoveItemsAtOnce>(
    (move: MaterialMove) => isMoveItemTypeAtOnce(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard
  )

  // Build options: show all with legal move, mark useful ones
  const visibleOptions = quantities
    .map((quantity, i) => ({
      quantity,
      factor: factors[i],
      effectiveGain: isZenithiumReward ? factors[i] : Math.min(factors[i], maxGain),
      move: exileMoves.find(m => m.indexes.length === quantity)
    }))
    .filter(opt => !!opt.move)
  // Mark each option as useful: its effective gain must be strictly better than the best cheaper option
  const optionsWithUsefulness = visibleOptions.map((opt, i) => {
    const bestCheaper = i > 0 ? Math.max(...visibleOptions.slice(0, i).map(o => o.effectiveGain)) : 0
    return { ...opt, useful: opt.effectiveGain > bestCheaper }
  })

  const getPreviewCards = (quantity: number) =>
    influenceCards.limit(quantity).getItems().map(item => item.id as Agent)

  return (
    <ZenithDialog open={true} onBackdropClick={onMinimize}>
      <div css={dialogContentCss}>
        {/* Header */}
        <div css={headerCss}>
          <div css={headerTextCss}>
            <span css={titleCss(color)}>{t(`planet.${influence}`)}</span>
            <span css={subtitleCss}>{t('exile-dialog.available', { count: availableCount })}</span>
          </div>
        </div>

        {/* Options */}
        <div css={optionsCss}>
          {optionsWithUsefulness.map(({ quantity, effectiveGain, move, useful }) => {
            const previewCards = getPreviewCards(quantity)

            return (
              <div
                key={quantity}
                css={[optionCardCss(color), useful ? clickableCardCss(color) : disabledCardCss]}
                onClick={() => { if (useful) { play(move!); onChosen ? onChosen() : onMinimize() } }}
              >
                {/* Reward header */}
                <div css={optionHeaderCss(color)}>
                  <span css={optionTitleCss}>
                    {t(resultingEffect.type === EffectType.WinZenithium ? 'exile-dialog.zenithium-gain' : 'exile-dialog.influence-gain', { count: effectiveGain })}
                  </span>
                </div>

                <div css={optionContentCss}>
                  {/* Cost */}
                  <div css={costSectionCss}>
                    <span css={costLabelCss}>{t('exile-dialog.cost')}</span>
                    <span css={costValueCss}>{t('exile-dialog.exile-count', { count: quantity })}</span>
                  </div>

                  {/* Card previews */}
                  <div css={previewSectionCss}>
                    <div css={previewGridCss}>
                      {previewCards.map((agentId, j) => (
                        <Picture
                          key={j}
                          src={agentCardDescription.images[agentId]}
                          css={thumbnailCss}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div css={optionFooterCss}>
                  {useful ? (
                    <span css={actionLabelCss(color)}>{t('exile-dialog.select')}</span>
                  ) : (
                    <span css={disabledLabelCss}>{t('exile-dialog.wasted')}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pass / Undo buttons */}
        <div css={footerButtonsCss}>
          {canUndoMove && (
            <button css={undoButtonCss} onClick={() => undo()}>
              {t('undo', 'Undo')}
            </button>
          )}
          <button css={passButtonCss} onClick={() => { if (pass) { play(pass); onChosen ? onChosen() : onMinimize() } }}>
            {t('exile-dialog.pass')}
          </button>
        </div>
      </div>
    </ZenithDialog>
  )
}

// ============ DIALOG STYLES ============

const dialogContentCss = css`
  position: relative;
  min-width: 70em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  font-size: 1.3em;
`

const headerCss = css`
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
`

const subtitleCss = css`
  font-size: 1.2em;
  color: #666;
`

// ============ OPTIONS LAYOUT ============

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
  min-width: 18em;
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

// ============ COST SECTION ============

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
`

// ============ CARD PREVIEWS ============

const previewSectionCss = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 5em;
`

const previewGridCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
  justify-content: center;
`

const thumbnailCss = css`
  width: 3em;
  height: 4.6em;
  border-radius: 0.3em;
  object-fit: cover;
  box-shadow: 0 0.1em 0.3em rgba(0, 0, 0, 0.2);
`

// ============ FOOTER ============

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

// ============ FOOTER BUTTONS ============

const footerButtonsCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  margin-top: 1em;
`

const undoButtonCss = css`
  padding: 0.6em 1.5em;
  border: 0.15em solid #9ca3af;
  border-radius: 0.5em;
  background: transparent;
  color: #6b7280;
  font-size: 1.2em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #6b7280;
    color: #374151;
  }
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

  &:active {
    transform: translateY(0);
    box-shadow: 0 0.05em 0.15em rgba(0, 0, 0, 0.1);
  }
`
