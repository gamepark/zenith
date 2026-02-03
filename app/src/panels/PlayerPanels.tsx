/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Avatar, MaterialContext, PlayerTimer, SpeechBubbleDirection, useMaterialContext, usePlayer, usePlayerName, usePlayers, useRules } from '@gamepark/react-game'
import { Credit } from '@gamepark/zenith/material/Credit'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { getMyTeamColor } from '../locators/position.utils'
import { creditTokenDescription } from '../material/CreditTokendescription'
import { zenithiumTokenDescription } from '../material/ZenithiumTokenDescription'
import LeaderGoldIcon from '../images/icons/leader-gold.png'
import LeaderSilverIcon from '../images/icons/leader-silver.png'

export const PlayerPanels = () => {
  const { t } = useTranslation()
  const players = usePlayers<PlayerId>({ sortFromMe: true })
  const root = document.getElementById('root')
  const rules = useRules<ZenithRules>()!
  const context = useMaterialContext()
  const gameOver = rules.isOver()

  // Speech bubble state - only show for 5 seconds after choice is made
  const chosenFirst = rules.remind<PlayerId>(Memory.TeamFirst)
  const [showSpeech, setShowSpeech] = useState(false)
  const prevChosenFirst = useRef<PlayerId | undefined>(undefined)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevChosenFirst.current = chosenFirst
      return
    }

    if (chosenFirst !== undefined && prevChosenFirst.current === undefined) {
      setShowSpeech(true)
      const timer = setTimeout(() => setShowSpeech(false), 5000)
      return () => clearTimeout(timer)
    }

    prevChosenFirst.current = chosenFirst
  }, [chosenFirst])

  // Get leader badge info
  const leaderBadge = rules.material(MaterialType.LeaderBadgeToken).getItem()
  const leaderTeam = leaderBadge?.location.player as TeamColor | undefined
  const isGoldBadge = leaderBadge?.location.rotation === true

  if (!root) return null

  return createPortal(
    <>
      {players.map((player) => {
        const team = getTeamColor(player.id)
        const playerHelper = new PlayerHelper(rules.game, player.id)
        const hasLeaderBadge = leaderTeam === team
        const isChosenFirst = showSpeech && chosenFirst === player.id
        const speak = isChosenFirst ? t('speech.starts-first') : undefined
        const isTurnToPlay = rules.isTurnToPlay(player.id)

        return (
          <PlayerPanel
            key={player.id}
            playerId={player.id}
            team={team}
            credits={playerHelper.credits}
            zenithium={playerHelper.zenithium}
            hasLeaderBadge={hasLeaderBadge}
            isGoldBadge={isGoldBadge}
            isTurnToPlay={isTurnToPlay}
            gameOver={gameOver}
            speak={speak}
            position={getPanelPosition(player.id, context)}
          />
        )
      })}
    </>,
    root
  )
}

// ============ Single Player Panel ============

type PlayerPanelProps = {
  playerId: PlayerId
  team: TeamColor
  credits: number
  zenithium: number
  hasLeaderBadge: boolean
  isGoldBadge: boolean
  isTurnToPlay: boolean
  gameOver: boolean
  speak?: string
  position: ReturnType<typeof css>
}

const PlayerPanel: FC<PlayerPanelProps> = ({
  playerId,
  team,
  credits,
  zenithium,
  hasLeaderBadge,
  isGoldBadge,
  isTurnToPlay,
  gameOver,
  speak,
  position
}) => {
  const playerName = usePlayerName(playerId)
  const player = usePlayer(playerId)
  const isWhite = team === TeamColor.White
  const panelRef = useRef<HTMLDivElement>(null)
  const gpDelta = player?.gamePointsDelta

  return (
    <div ref={panelRef} css={[panelCss, isWhite ? panelWhiteCss : panelBlackCss, position]}>
      {/* Left: Avatar + Info */}
      <div css={leftSideCss}>
        {/* Avatar wrapper */}
        <div css={avatarWrapperCss}>
          {isTurnToPlay && (
            <div css={activeRingCss}>
              <div css={activeRingCircleCss} />
            </div>
          )}
          <Avatar
            playerId={playerId}
            css={avatarCss}
            speechBubbleProps={speak ? {
              direction: getSpeechDirection(panelRef.current),
              children: <>{speak}</>
            } : undefined}
          />
        </div>

        <div css={infoCss}>
          <span css={[nameCss, !isWhite && nameBlackCss]}>{playerName}</span>
          <div css={[statsCss, !isWhite && statsBlackCss]}>
            <span css={statCss}>
              <img src={creditTokenDescription.images[Credit.Credit1]} css={iconCss} alt="" />
              {credits}
            </span>
            <span css={statCss}>
              <img src={zenithiumTokenDescription.image} css={iconCss} alt="" />
              {zenithium}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Timer/GP + Leader */}
      <div css={rightSideCss}>
        {gameOver && gpDelta !== undefined && gpDelta !== null ? (
          <div css={gpBadgeCss}>
            <span css={gpIconCss}>🏆</span>
            <span>{gpDelta > 0 ? `+${gpDelta}` : gpDelta}</span>
          </div>
        ) : (
          <div css={timerBadgeCss}>
            <span>⏱</span>
            <PlayerTimer playerId={playerId} css={timerCss} />
          </div>
        )}
        {hasLeaderBadge && (
          <img
            src={isGoldBadge ? LeaderGoldIcon : LeaderSilverIcon}
            alt="Leader"
            css={leaderCss}
          />
        )}
      </div>
    </div>
  )
}

// ============ Helpers ============

const getSpeechDirection = (element: HTMLDivElement | null): SpeechBubbleDirection => {
  if (!element) return SpeechBubbleDirection.BOTTOM_RIGHT
  const rect = element.getBoundingClientRect()
  const left = rect.left / window.innerWidth
  const top = rect.top / window.innerHeight
  const isLeft = left > 0.5
  const isTop = top > 0.5
  if (isLeft) {
    return isTop ? SpeechBubbleDirection.TOP_LEFT : SpeechBubbleDirection.BOTTOM_LEFT
  }
  return isTop ? SpeechBubbleDirection.TOP_RIGHT : SpeechBubbleDirection.BOTTOM_RIGHT
}

const getPanelPosition = (player: PlayerId, context: MaterialContext) => {
  const itsMyTeam = getMyTeamColor(context) === getTeamColor(player)
  const is2Players = context.rules.players.length === 2

  if (is2Players) {
    const itsMe = (context.player ?? context.rules.players[0]) === player
    return itsMe ? bottomRightCss : topLeftCss
  }

  if (itsMyTeam) {
    const itsMe = (context.player ?? context.rules.players[0]) === player
    return itsMe ? bottomLeftCss : bottomRightCss
  } else {
    const opponents = context.rules.players.filter((p) => getMyTeamColor(context) !== getTeamColor(p))
    return opponents[0] === player ? topLeftCss : topRightCss
  }
}

// ============ Position CSS ============

const topLeftCss = css`
  left: 1em;
  top: 6em;
`

const topRightCss = css`
  right: 1em;
  top: 6em;
`

const bottomLeftCss = css`
  left: 1em;
  bottom: 1em;
`

const bottomRightCss = css`
  right: 1em;
  bottom: 1em;
`

// ============ Panel CSS (Option 4C - Bigger) ============

const panelCss = css`
  position: absolute;
  z-index: 100;
  font-size: 1.5em;
  width: 22em;
  padding: 0.9em;
  border-radius: 0.7em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const panelWhiteCss = css`
  background: linear-gradient(145deg, #fff 0%, #f0f0f5 100%);
  border: 1px solid #d0d0d5;
  border-left: 4px solid #a0a0a8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const panelBlackCss = css`
  background: linear-gradient(145deg, #35353a 0%, #25252a 100%);
  border: 1px solid #505055;
  border-left: 4px solid #707078;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`

const leftSideCss = css`
  display: flex;
  align-items: center;
  gap: 0.7em;
`

// Avatar wrapper with proper containment
const avatarWrapperCss = css`
  position: relative;
  width: 3.2em;
  height: 3.2em;
  flex-shrink: 0;
`

const avatarCss = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 1;
`

const infoCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const nameCss = css`
  font-weight: 600;
  font-size: 1.1em;
  color: #2d3748;
  max-width: 7em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const nameBlackCss = css`
  color: #e8e8ec;
`

const statsCss = css`
  display: flex;
  gap: 1em;
  font-size: 1em;
  font-weight: 500;
  color: #4a5568;
`

const statsBlackCss = css`
  color: #a0aec0;
`

const statCss = css`
  display: flex;
  align-items: center;
  gap: 0.25em;
`

const iconCss = css`
  width: 1.3em;
  height: 1.3em;
  object-fit: contain;
`

const rightSideCss = css`
  display: flex;
  align-items: center;
  gap: 0.6em;
`

const timerBadgeCss = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  background: linear-gradient(135deg, #e8f4fd 0%, #d0e8f8 100%);
  border: 1px solid #90cdf4;
  border-radius: 0.4em;
  padding: 0.45em 0.8em;
  font-size: 1.05em;
  font-weight: 700;
  color: #2b6cb0;
`

const timerCss = css`
  font-weight: 700;
  color: inherit;
`

const gpBadgeCss = css`
  display: flex;
  align-items: center;
  gap: 0.3em;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 0.4em;
  padding: 0.45em 0.8em;
  font-size: 1.05em;
  font-weight: 700;
  color: #92400e;
`

const gpIconCss = css`
  font-size: 1em;
`

const leaderCss = css`
  width: 2.5em;
  height: auto;
`

// ============ Active Ring ============

const activeRingCss = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
`

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const activeRingCircleCss = css`
  position: absolute;
  top: -0.35em;
  left: -0.35em;
  right: -0.35em;
  bottom: -0.35em;
  border-radius: 50%;
  background: linear-gradient(to bottom, gold 0%, #28b8ce 100%);
  animation: ${rotateAnimation} 1s linear infinite;
`
