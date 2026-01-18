/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialContext, StyledPlayerPanel, useMaterialContext, usePlayers, useRules } from '@gamepark/react-game'
import { Credit } from '@gamepark/zenith/material/Credit'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { useEffect, useRef, useState } from 'react'
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

  // Speech bubble state - only show for 5 seconds after choice is made
  const chosenFirst = rules.remind<PlayerId>(Memory.TeamFirst)
  const [showSpeech, setShowSpeech] = useState(false)
  const prevChosenFirst = useRef<PlayerId | undefined>(undefined)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip first render (page load)
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevChosenFirst.current = chosenFirst
      return
    }

    // Detect when chosenFirst changes from undefined to a value
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

  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player) => {
        const team = getTeamColor(player.id)
        const playerHelper = new PlayerHelper(rules.game, player.id)
        const hasLeaderBadge = leaderTeam === team

        // Show speech bubble if this player was just chosen to go first
        const isChosenFirst = showSpeech && chosenFirst === player.id
        const speak = isChosenFirst ? t('speech.starts-first') : undefined

        return (
          <div key={player.id} css={[panelPosition, getPanelPosition(player.id, context)]}>
            <StyledPlayerPanel
              activeRing
              countersPerLine={2}
              player={player}
              speak={speak}
              css={[panelContentCss, team === TeamColor.White ? whitePanelCss : blackPanelCss]}
              counters={[
                { image: creditTokenDescription.images[Credit.Credit1], value: playerHelper.credits },
                { image: zenithiumTokenDescription.image, value: playerHelper.zenithium }
              ]}
            />
            {hasLeaderBadge && (
              <img
                src={isGoldBadge ? LeaderGoldIcon : LeaderSilverIcon}
                alt="Leader"
                css={leaderBadgeCss}
              />
            )}
          </div>
        )
      })}
    </>,
    root
  )
}

const panelPosition = css`
  position: absolute;
  width: 22em;
`

const panelContentCss = css`
  border-radius: 0.8em !important;

  > div:last-of-type {
    flex-direction: row;

    > div {
      width: 50%;
    }
  }
`

const leaderBadgeCss = css`
  position: absolute;
  right: -0.8em;
  top: -0.8em;
  width: 3em;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
`

const getPanelPosition = (player: PlayerId, context: MaterialContext) => {
  const itsMyTeam = isMyTeam(player, context)
  const is2Players = context.rules.players.length === 2

  if (is2Players) {
    const itsMe = (context.player ?? context.rules.players[0]) === player
    return itsMe ? bottomRightPanelCss : topLeftPanelCss
  }

  // 4 players
  if (itsMyTeam) {
    const itsMe = (context.player ?? context.rules.players[0]) === player
    return itsMe ? bottomLeftPanelCss : bottomRightPanelCss
  } else {
    const opponents = context.rules.players.filter((p) => !isMyTeam(p, context))
    const isFirst = opponents[0] === player
    return isFirst ? topLeftPanelCss : topRightPanelCss
  }
}

const isMyTeam = (player: PlayerId, context: MaterialContext) => {
  return getMyTeamColor(context) === getTeamColor(player)
}

const topLeftPanelCss = css`
  left: 1em;
  top: 9em;
`

const topRightPanelCss = css`
  right: 1em;
  top: 9em;
`

const bottomLeftPanelCss = css`
  left: 1em;
  bottom: 1em;
`

const bottomRightPanelCss = css`
  right: 1em;
  bottom: 1em;
`

// Team White
const whitePanelCss = css`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.97) 0%, rgba(235, 235, 240, 0.95) 100%);
  border: 2px solid #d0d0d5;
  border-left: 4px solid #a0a0a8;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
`

// Team Black
const blackPanelCss = css`
  background: linear-gradient(145deg, rgba(50, 50, 55, 0.97) 0%, rgba(30, 30, 35, 0.95) 100%);
  border: 2px solid #505055;
  border-left: 4px solid #707078;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  > h2 {
    color: #e8e8ec;
  }
`
