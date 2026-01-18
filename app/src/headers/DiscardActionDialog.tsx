/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture, useLegalMove, usePlay, useRules, useUndo } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType } from '@gamepark/rules-api'
import { Effect } from '@gamepark/zenith/material/effect/Effect'
import { Faction } from '@gamepark/zenith/material/Faction'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { getDiplomacyActions } from '@gamepark/zenith/rules/discard-action/DiplomacyActions'
import { getTechnologyAction } from '@gamepark/zenith/rules/discard-action/TechnologyActions'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { EffectText } from '../components/EffectText'
import { ZenithDialog } from '../components/ZenithDialog'
import AnimodIcon from '../images/icons/animod.jpg'
import HumanoidIcon from '../images/icons/humanoid.jpg'
import RobotIcon from '../images/icons/robot.jpg'
import Zenithium from '../images/zenithium/Zenithium.png'

type Props = {
  onMinimize: () => void
}

export const DiscardActionDialog: FC<Props> = ({ onMinimize }) => {
  const { t } = useTranslation()
  const rules = useRules<ZenithRules>()!
  const [undo, canUndo] = useUndo()
  const play = usePlay()
  const faction = rules.remind<Faction>(Memory.DiscardFaction)
  const diplomacyMove = useLegalMove(isCustomMoveType(CustomMoveType.Diplomacy))
  const techMove = useLegalMove(isMoveItemType(MaterialType.TechMarker))

  const handleTechClick = () => {
    if (techMove) {
      play(techMove)
    }
  }

  const handleDiplomacyClick = () => {
    if (diplomacyMove) {
      play(diplomacyMove)
    }
  }

  const activePlayer = rules.getActivePlayer()
  const myTeam = activePlayer ? getTeamColor(activePlayer) : undefined

  // Tech position and cost
  const techBoard = rules.material(MaterialType.TechnologyBoard)
    .location(l => l.type === LocationType.TechnologyBoardPlace && l.id === faction)
  const boardItem = techBoard.getItem<string>()
  const techMarker = rules.material(MaterialType.TechMarker)
    .location(l => l.type === LocationType.TechnologyBoardTokenSpace)
    .player(myTeam)
    .parent(techBoard.getIndex())
  const currentPos = techMarker.getItem()?.location.x ?? 0
  const techCost = currentPos + 1

  // Get tech bonuses per level (reversed: highest level first)
  const techActions = boardItem ? getTechnologyAction(boardItem.id) : []
  const techLevels = techActions.slice(0, currentPos + 1).map((effects, i) => ({ level: i + 1, effects })).reverse()

  // Get diplomacy effects
  const diplomacyEffects = faction ? getDiplomacyActions(rules.game.players.length)[faction] : []

  if (!faction) return null

  const factionConfig = {
    [Faction.Animod]: { icon: AnimodIcon, color: '#4a9e5c' },
    [Faction.Human]: { icon: HumanoidIcon, color: '#3b82c4' },
    [Faction.Robot]: { icon: RobotIcon, color: '#9b5de5' }
  }

  const { icon, color } = factionConfig[faction]

  return (
    <ZenithDialog open={true}>
      <div css={dialogContentCss}>
      {/* Minimize button */}
      <button css={minimizeButtonCss} onClick={onMinimize} title={t('discard-action.minimize')}>
        −
      </button>
      {/* Header */}
      <div css={headerCss}>
        <Picture src={icon} css={factionIconCss} />
        <div css={headerTextCss}>
          <span css={titleCss}>{t(`faction.${faction}`)}</span>
          <span css={subtitleCss}>{t('discard-action.title')}</span>
        </div>
      </div>

      <div css={optionsCss}>
        {/* Technology Option */}
        <div
          css={[optionCardCss(color), techMove && clickableCardCss(color), !techMove && disabledCardCss]}
          onClick={handleTechClick}
        >
          <div css={optionHeaderCss(color)}>
            <span css={optionTitleCss}>{t('discard-action.technology')}</span>
          </div>

          <div css={optionContentCss}>
            {/* Cost */}
            <div css={costRowCss}>
              <span css={costLabelCss}>{t('discard-action.cost')}</span>
              <div css={costValueCss}>
                <Picture src={Zenithium} css={resourceIconCss} />
                <span css={costNumberCss}>×{techCost}</span>
              </div>
            </div>

            {/* Gains */}
            <div css={gainsContainerCss}>
              <span css={gainsLabelCss}>{t('discard-action.gains')}</span>
              <div css={effectsListCss}>
                {techLevels.length > 0 ? (
                  techLevels.map(({ level, effects }, i) => (
                    <div key={level} css={levelBlockCss}>
                      {i > 0 && <div css={levelSeparatorCss} />}
                      <div css={levelHeaderCss}>Niveau {level}</div>
                      {effects.map((effect, j) => (
                        <EffectDisplay key={j} effect={effect} />
                      ))}
                    </div>
                  ))
                ) : (
                  <span css={noBonusCss}>—</span>
                )}
              </div>
            </div>
          </div>

          <div css={optionFooterCss}>
            {techMove ? (
              <span css={actionLabelCss(color)}>{t('discard-action.technology.button')}</span>
            ) : (
              <span css={unavailableCss}>{t('discard-action.technology.unavailable')}</span>
            )}
          </div>
        </div>

        {/* Separator */}
        <div css={separatorCss}>
          <span css={separatorTextCss}>{t('or')}</span>
        </div>

        {/* Diplomacy Option */}
        <div
          css={[optionCardCss(color), diplomacyMove && clickableCardCss(color)]}
          onClick={handleDiplomacyClick}
        >
          <div css={optionHeaderCss(color)}>
            <span css={optionTitleCss}>{t('discard-action.diplomacy')}</span>
          </div>

          <div css={optionContentCss}>
            {/* Gains */}
            <div css={gainsContainerCss}>
              <span css={gainsLabelCss}>{t('discard-action.gains')}</span>
              <div css={effectsListCss}>
                {diplomacyEffects.map((effect, i) => (
                  <EffectDisplay key={i} effect={effect} />
                ))}
              </div>
            </div>
          </div>

          <div css={optionFooterCss}>
            <span css={actionLabelCss(color)}>{t('discard-action.diplomacy.button')}</span>
          </div>
        </div>
      </div>

      {canUndo() && (
        <button onClick={() => undo()} css={cancelButtonCss}>
          {t('discard-action.cancel')}
        </button>
      )}
      </div>
    </ZenithDialog>
  )
}

// Effect display component with bullet point styling
const EffectDisplay: FC<{ effect: Effect }> = ({ effect }) => (
  <div css={effectRowCss}>
    <span css={bulletCss}>•</span>
    <EffectText effect={effect} />
  </div>
)

// ============ DIALOG STYLES ============

const dialogContentCss = css`
  position: relative;
  min-width: 85em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  font-size: 1.3em;
`

const minimizeButtonCss = css`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  width: 2em;
  height: 2em;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.3em;
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`

const headerCss = css`
  display: flex;
  align-items: center;
  gap: 1.2em;
  margin-bottom: 1.5em;
  padding-bottom: 1em;
  border-bottom: 0.15em solid rgba(0,0,0,0.1);
`

const factionIconCss = css`
  width: 5em;
  height: 5em;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0.2em 0.6em rgba(0,0,0,0.3);
`

const headerTextCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const titleCss = css`
  font-size: 2.2em;
  font-weight: 700;
  color: #2d3748;
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
  min-width: 22em;
  background: white;
  border-radius: 1em;
  overflow: hidden;
  box-shadow: 0 0.2em 1em rgba(0,0,0,0.1);
  border: 0.15em solid ${color}33;
  transition: all 0.2s ease;
`

const clickableCardCss = (color: string) => css`
  cursor: pointer;

  &:hover {
    box-shadow: 0 0.3em 1.5em rgba(0,0,0,0.2), 0 0 0 0.2em ${color}40;
    border-color: ${color};
  }

  &:active {
    box-shadow: 0 0.15em 0.8em rgba(0,0,0,0.15);
  }
`

const disabledCardCss = css`
  opacity: 0.6;
  cursor: not-allowed;
`

const optionHeaderCss = (color: string) => css`
  background: ${color};
  padding: 1em 1.5em;
`

const optionTitleCss = css`
  font-size: 1.5em;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.2);
`

const optionContentCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2em;
  padding: 1.5em;
`

const optionFooterCss = css`
  padding: 1em 1.5em;
  background: rgba(0,0,0,0.03);
  border-top: 1px solid rgba(0,0,0,0.08);
`

// ============ COST SECTION ============

const costRowCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8em 1em;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.6em;
  border: 1px solid #f59e0b;
`

const costLabelCss = css`
  font-size: 1.1em;
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
`

const costValueCss = css`
  display: flex;
  align-items: center;
  gap: 0.4em;
`

const resourceIconCss = css`
  width: 2em;
  height: 2em;
  object-fit: contain;
`

const costNumberCss = css`
  font-size: 1.5em;
  font-weight: 700;
  color: #b45309;
`

// ============ GAINS SECTION ============

const gainsContainerCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.6em;
`

const gainsLabelCss = css`
  font-size: 1.1em;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
`

const effectsListCss = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
  padding: 1em;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 0.6em;
  border: 1px solid #86efac;
`

const effectRowCss = css`
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  font-size: 1.15em;
  color: #166534;
  line-height: 1.6;
  text-align: left;
`

const bulletCss = css`
  color: #22c55e;
  font-size: 1.2em;
  font-weight: bold;
`

const noBonusCss = css`
  font-size: 1.2em;
  color: #999;
`

const levelBlockCss = css`
  width: 100%;
`

const levelSeparatorCss = css`
  height: 1px;
  background: linear-gradient(90deg, transparent, #86efac, transparent);
  margin: 0.8em 0;
`

const levelHeaderCss = css`
  font-size: 0.85em;
  font-weight: 700;
  color: #059669;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.4em;
`

// ============ SEPARATOR ============

const separatorCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const separatorTextCss = css`
  font-size: 1.4em;
  color: #888;
  font-style: italic;
  font-weight: 500;
`

// ============ BUTTONS ============

const unavailableCss = css`
  font-size: 1.1em;
  color: #999;
  font-style: italic;
`

const actionLabelCss = (color: string) => css`
  font-size: 1.2em;
  font-weight: 600;
  color: ${color};
  text-transform: uppercase;
`

const cancelButtonCss = css`
  margin-top: 1em;
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
    box-shadow: 0 0.05em 0.15em rgba(0,0,0,0.1);
  }
`

