/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, Picture, PlayMoveButton, useGame, useLegalMoves, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, isMoveItemType, MaterialGame, MaterialItem, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import { Agent } from '@gamepark/zenith/material/Agent'
import { Agents } from '@gamepark/zenith/material/Agents'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { InfluenceHelper } from '@gamepark/zenith/rules/helper/InfluenceHelper'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { FC, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getColorForInfluence, helpCss } from '../i18n/trans.components'
import { EffectText, getFactionIcon, getPlanetIcon } from '../components/EffectText'
import { actionButtonCss, actionSectionCss, CollapsibleDetails } from './HelpActionButton'
import Credit from '../images/credit/Credit1.png'

export const AgentCardHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const agentId = item.id as Agent | undefined
  const rules = useRules()
  const isMulligan = rules?.game.rule?.id === RuleId.Muligan
  const moves = useLegalMoves<MoveItem>((move: MaterialMove) =>
    isMoveItemType(MaterialType.AgentCard)(move) && move.itemIndex === itemIndex && move.location.type !== LocationType.AgentDiscard
  )
  const discardMoves = useLegalMoves<MoveItem>((move: MaterialMove) =>
    !isMulligan && isMoveItemType(MaterialType.AgentCard)(move) && move.itemIndex === itemIndex && move.location.type === LocationType.AgentDiscard
  )
  const mulliganDiscard = useLegalMoves<MoveItem>((move: MaterialMove) =>
    isMulligan && isMoveItemType(MaterialType.AgentCard)(move) && move.itemIndex === itemIndex && move.location.type === LocationType.AgentDiscard
  )
  const discardForTech = useLegalMoves<CustomMove>((move: MaterialMove) => isCustomMoveType(CustomMoveType.DiscardForTech)(move) && move.data === itemIndex)
  const discardForDiplomacy = useLegalMoves<CustomMove>((move: MaterialMove) => isCustomMoveType(CustomMoveType.DiscardForDiplomacy)(move) && move.data === itemIndex)
  const hasActions = moves.length > 0 || discardMoves.length > 0 || mulliganDiscard.length > 0 || discardForTech.length > 0 || discardForDiplomacy.length > 0
  const hadActionsRef = useRef(hasActions)
  if (hasActions) hadActionsRef.current = true
  const ownerName = usePlayerName(item.location?.player)

  // Handle hidden/unknown cards
  if (agentId === undefined || !Agents[agentId]) {
    const isDeck = item.location?.type === LocationType.AgentDeck
    return (
      <div css={hiddenCardCss}>
        <div css={hiddenTitleCss}>{t(isDeck ? 'help.agent.deck' : 'help.agent.hidden')}</div>
        <div css={hiddenDescCss}>{t(isDeck ? 'help.agent.deck.desc' : 'help.agent.hidden.desc', { player: ownerName })}</div>
      </div>
    )
  }

  const actions = (
    <div css={actionSectionCss}>
      {moves.map((move, i) => (
        <PlayMoveButton key={i} move={move} onPlay={closeDialog} css={actionButtonCss}>
          {getActionLabel(t, item, move)}
        </PlayMoveButton>
      ))}
      {discardMoves.map((move, i) => (
        <PlayMoveButton key={`discard-${i}`} move={move} onPlay={closeDialog} css={actionButtonCss}>
          {item.location?.type === LocationType.Influence ? t('help.action.exile') : t('help.action.discard')}
        </PlayMoveButton>
      ))}
      {mulliganDiscard.length > 0 && (
        <PlayMoveButton move={mulliganDiscard[0]} onPlay={closeDialog} css={actionButtonCss}>
          {t('help.action.discard', 'Discard')}
        </PlayMoveButton>
      )}
      {discardForTech.length > 0 && (
        <PlayMoveButton move={discardForTech[0]} onPlay={closeDialog} css={actionButtonCss}>
          <Trans i18nKey="help.action.develop.faction" components={{ faction: getFactionIcon(Agents[agentId].faction) }} />
        </PlayMoveButton>
      )}
      {discardForDiplomacy.length > 0 && (
        <PlayMoveButton move={discardForDiplomacy[0]} onPlay={closeDialog} css={actionButtonCss}>
          {t('help.action.diplomacy', 'Take Leadership')}
        </PlayMoveButton>
      )}
    </div>
  )

  const content = <AgentCardHelpContent agentId={agentId} item={item} />

  if (hadActionsRef.current) {
    return (
      <CollapsibleDetails actions={actions}>
        {content}
      </CollapsibleDetails>
    )
  }

  return content
}

const getActionLabel = (t: TFunction, item: Partial<MaterialItem>, move: MoveItem): string => {
  const fromHand = item.location?.type === LocationType.PlayerHand
  if (fromHand) {
    if (move.location.type === LocationType.Influence) return t('help.action.recruit')
    if (move.location.type === LocationType.PlayerHand) return t('help.action.share')
    return t('help.action.discard')
  }
  if (move.location.type === LocationType.AgentDiscard) return t('help.action.exile')
  if (move.location.type === LocationType.Influence) return t('help.action.transfer')
  return t('help.action.discard')
}

const hiddenCardCss = css`
  min-width: 16em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
`

const hiddenTitleCss = css`
  font-size: 1.1em;
  font-weight: 700;
  color: #3e3020;
`

const hiddenDescCss = css`
  font-size: 0.95em;
  color: rgba(62, 48, 32, 0.5);
  font-style: italic;
`

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isInHand && game && playerId ? new InfluenceHelper(game, new PlayerHelper(game, playerId).team).getCost({ id: agentId } as any) : null

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
                {getFactionIcon(agentData.faction)}
                <span>{t(`faction.${agentData.faction}`)}</span>
              </div>
            </div>
            <div css={identityItemCss}>
              <span css={identityLabelCss}>{t('help.planet')}</span>
              <div css={identityValueCss}>
                {getPlanetIcon(agentData.influence)}
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
  width: 100%;
  min-width: 32em;
  display: flex;
  flex-direction: column;
  gap: 0.4em;
`

const sectionCss = css`
  border-radius: 0.3em;
  overflow: hidden;
  box-shadow: 0 0.04em 0.2em rgba(0, 0, 0, 0.08);
  border: 0.06em solid rgba(0, 0, 0, 0.08);
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
  background: #faf6ef;
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
  background: rgba(212, 135, 42, 0.05);
  border-radius: 0.3em;
  border: 0.06em solid rgba(212, 135, 42, 0.12);
`

const identityLabelCss = css`
  font-size: 0.75em;
  font-weight: 600;
  color: rgba(62, 48, 32, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

const identityValueCss = css`
  display: flex;
  align-items: center;
  gap: 0.25em;
  font-weight: 600;
  color: #3e3020;
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
  border: 0.06em solid #f59e0b;
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
    left: -0.12em;
    right: -0.12em;
    top: 50%;
    height: 0.12em;
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
  border-bottom: 0.06em solid rgba(212, 135, 42, 0.08);

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
  color: #3e3020;
  font-size: 1em;
`

// Compact mode styles
const compactContainerCss = css`
  width: 24em;
  background: #faf6ef;
  font-size: 0.875em;
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
    border-bottom: 0.06em solid rgba(212, 135, 42, 0.08);
  }
`
