/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Picture, useLegalMove, usePlay, useRules, useUndo } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType } from '@gamepark/rules-api'
import { Effect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Faction } from '@gamepark/zenith/material/Faction'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { getTechnologyAction } from '@gamepark/zenith/rules/discard-action/TechnologyActions'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ZenithDialog } from '../components/ZenithDialog'
import { HelpTransComponents } from '../i18n/trans.components'
import AgentBack from '../images/agents/Back.jpg'
import Credit1 from '../images/credit/Credit1.png'
import AnimodIcon from '../images/icons/animod.jpg'
import HumanoidIcon from '../images/icons/humanoid.jpg'
import LeaderGoldIcon from '../images/icons/leader-gold.png'
import LeaderSilverIcon from '../images/icons/leader-silver.png'
import RobotIcon from '../images/icons/robot.jpg'
import Zenithium from '../images/zenithium/Zenithium.png'

type Props = {
  onClose: () => void
}

export const DiscardActionDialog: FC<Props> = ({ onClose }) => {
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
      onClose()
    }
  }

  const handleDiplomacyClick = () => {
    if (diplomacyMove) {
      play(diplomacyMove)
      onClose()
    }
  }

  const activePlayer = rules.getActivePlayer()
  const myTeam = activePlayer ? getTeamColor(activePlayer) : undefined

  // Badge state after diplomacy
  const leaderBadge = rules.material(MaterialType.LeaderBadgeToken).getItem()
  const currentlyHaveBadge = leaderBadge?.location.player === myTeam
  const willBeGold = currentlyHaveBadge
  const BadgeIcon = willBeGold ? LeaderGoldIcon : LeaderSilverIcon

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

  // Get tech bonuses - cumulative: level N gives bonuses from N down to 1
  const techActions = boardItem ? getTechnologyAction(boardItem.id) : []
  const allBonuses = techActions.slice(0, currentPos + 1).flat()

  if (!faction) return null

  const factionConfig = {
    [Faction.Animod]: { icon: AnimodIcon, color: '#4a9e5c', bonusIcon: AgentBack, bonusCount: 2 },
    [Faction.Human]: { icon: HumanoidIcon, color: '#3b82c4', bonusIcon: Credit1, bonusCount: 3 },
    [Faction.Robot]: { icon: RobotIcon, color: '#9b5de5', bonusIcon: Zenithium, bonusCount: 1 }
  }

  const { icon, color, bonusIcon, bonusCount } = factionConfig[faction]

  return (
    <ZenithDialog open={true}>
      <div css={dialogContentCss}>
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
                {allBonuses.length > 0 ? (
                  allBonuses.map((effect, i) => (
                    <EffectDisplay key={i} effect={effect} />
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
              <div css={diplomacyGainsCss}>
                <div css={diplomacyItemCss}>
                  <Picture src={BadgeIcon} css={diplomacyIconCss} />
                  <span css={diplomacyLabelCss}>{t('discard-action.leader-badge')}</span>
                </div>
                <span css={plusSignCss}>+</span>
                <div css={diplomacyItemCss}>
                  <Picture src={bonusIcon} css={diplomacyIconCss} />
                  <span css={diplomacyValueCss}>×{bonusCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div css={optionFooterCss}>
            <span css={actionLabelCss(color)}>{t('discard-action.diplomacy.button')}</span>
          </div>
        </div>
      </div>

      {canUndo() && (
        <button onClick={() => { undo(); onClose() }} css={cancelButtonCss}>
          {t('Cancel')}
        </button>
      )}
      </div>
    </ZenithDialog>
  )
}

// Effect display component - uses same translations as AgentCardHelp
const EffectDisplay: FC<{ effect: Effect }> = ({ effect }) => {
  const { t } = useTranslation()
  const components = { ...HelpTransComponents, badge: HelpTransComponents.leaderSilver }

  switch (effect.type) {
    case EffectType.WinCredit:
      return (
        <div css={effectRowCss}>
          <span css={bulletCss}>•</span>
          <Trans i18nKey="help.win-credit" values={{ count: effect.quantity ?? 1 }} components={components} />
        </div>
      )
    case EffectType.WinInfluence: {
      const count = effect.quantity ?? (effect.pattern ? effect.pattern.reduce((a, b) => a + b, 0) : 1)
      return (
        <div css={effectRowCss}>
          <span css={bulletCss}>•</span>
          <span>
            <Trans i18nKey="help.win-influence" values={{ count }} components={components} />
            <span css={noteCss}> ({t('help.choice')})</span>
          </span>
        </div>
      )
    }
    case EffectType.WinZenithium:
      return (
        <div css={effectRowCss}>
          <span css={bulletCss}>•</span>
          <Trans i18nKey="help.win-zenithium" values={{ count: effect.quantity ?? 1 }} components={components} />
        </div>
      )
    case EffectType.Transfer:
      return (
        <div css={effectRowCss}>
          <span css={bulletCss}>•</span>
          <span>
            <Trans i18nKey="help.transfer" values={{ count: effect.quantity ?? 1 }} components={components} />
            <span css={noteCss}> ({t('help.choice')})</span>
          </span>
        </div>
      )
    case EffectType.Mobilize:
      return (
        <div css={effectRowCss}>
          <span css={bulletCss}>•</span>
          <div>
            <Trans i18nKey="help.mobilize.short" values={{ count: effect.quantity ?? 1 }} components={components} />
            <div css={effectNoteCss}>{t('help.mobilize.note')}</div>
          </div>
        </div>
      )
    case EffectType.TakeLeaderBadge:
      return (
        <div css={effectRowCss}>
          <span css={bulletCss}>•</span>
          <Trans i18nKey="help.take-leader" components={components} />
        </div>
      )
    case EffectType.TakeTechnologyBonusToken:
      return (
        <div css={effectRowCss}>
          <span css={bulletCss}>•</span>
          <Trans i18nKey="help.take-tech-token" components={components} />
        </div>
      )
    case EffectType.Conditional:
      return <EffectDisplay effect={effect.effect} />
    default:
      return null
  }
}

// ============ DIALOG STYLES ============

const dialogContentCss = css`
  min-width: 85em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
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
    transform: translateY(-0.3em);
    box-shadow: 0 0.5em 2em rgba(0,0,0,0.15);
    border-color: ${color};
  }

  &:active {
    transform: translateY(-0.1em);
    box-shadow: 0 0.2em 1em rgba(0,0,0,0.12);
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

const noteCss = css`
  font-style: italic;
  color: #059669;
  font-size: 0.9em;
`

const effectNoteCss = css`
  font-style: italic;
  color: #059669;
  font-size: 0.95em;
`

const noBonusCss = css`
  font-size: 1.2em;
  color: #999;
`

// ============ DIPLOMACY GAINS ============

const diplomacyGainsCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2em;
  padding: 1.5em;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-radius: 0.6em;
  border: 1px solid #f9a8d4;
`

const diplomacyItemCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
`

const diplomacyIconCss = css`
  width: 4em;
  height: 4em;
  object-fit: contain;
`

const diplomacyLabelCss = css`
  font-size: 1em;
  color: #9d174d;
  font-weight: 500;
`

const diplomacyValueCss = css`
  font-size: 1.4em;
  font-weight: 700;
  color: #9d174d;
`

const plusSignCss = css`
  font-size: 2.5em;
  font-weight: 700;
  color: #db2777;
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
  padding: 0.7em 2em;
  border: 0.15em solid #ccc;
  border-radius: 0.5em;
  background: transparent;
  color: #666;
  font-size: 1.1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0,0,0,0.05);
    border-color: #999;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 0.05em 0.15em rgba(0,0,0,0.1);
  }
`
