/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useMaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getAllowedPlanets, getPlayerSide, getTeamColor, PlayerSide, TeamColor } from '@gamepark/zenith/TeamColor'

const PLANET_COLORS: Record<Influence, string> = {
  [Influence.Mercury]: '#8b7bb5',
  [Influence.Venus]: '#e8943a',
  [Influence.Terra]: '#4fb4d8',
  [Influence.Mars]: '#c8384a',
  [Influence.Jupiter]: '#5ba89e'
}

const PLANET_NAMES: Record<Influence, string> = {
  [Influence.Mercury]: 'Mercury',
  [Influence.Venus]: 'Venus',
  [Influence.Terra]: 'Terra',
  [Influence.Mars]: 'Mars',
  [Influence.Jupiter]: 'Jupiter'
}

type ColumnStatus = 'yours' | 'shared' | 'teammate'

function getColumnStatus(planet: Influence, player: PlayerId): ColumnStatus {
  const myPlanets = getAllowedPlanets(player)
  if (!myPlanets.includes(planet)) return 'teammate'
  const side = getPlayerSide(player)
  const teammatePlanets = side === PlayerSide.Technology
    ? getAllowedPlanets(3 as PlayerId)
    : getAllowedPlanets(1 as PlayerId)
  if (teammatePlanets.includes(planet)) return 'shared'
  return 'yours'
}

const STATUS_LABELS: Record<ColumnStatus, string> = {
  yours: 'Yours',
  shared: 'Shared',
  teammate: 'Teammate'
}

const STATUS_TAG: Record<ColumnStatus, { color: string; bg: string }> = {
  yours: { color: '#fff', bg: 'rgba(212,135,42,0.85)' },
  shared: { color: '#fff', bg: 'rgba(79,180,216,0.75)' },
  teammate: { color: '#fff', bg: 'rgba(255,255,255,0.3)' }
}

export const InfluenceColumnContent = ({ location }: { location: Location }) => {
  const context = useMaterialContext()
  const me: PlayerId | undefined = context.player as PlayerId | undefined
  const planet = location.id as Influence
  if (!planet) return null
  const is4Players = context.rules && context.rules.players.length === 4
  if (!is4Players) return null
  const color = PLANET_COLORS[planet]
  const name = PLANET_NAMES[planet]

  if (!me) {
    return (
      <div css={containerCss}>
        <span css={nameCss} style={{ color }}>{name}</span>
      </div>
    )
  }

  const team = location.player as TeamColor
  const myTeam = getTeamColor(me)
  const isMyTeam = team === myTeam

  if (!isMyTeam) {
    return (
      <div css={containerCss}>
        <span css={nameCss} style={{ color }}>{name}</span>
      </div>
    )
  }

  const status = getColumnStatus(planet, me)
  const statusLabel = STATUS_LABELS[status]
  const tag = STATUS_TAG[status]

  return (
    <div css={containerCss}>
      <span css={nameCss} style={{ color }}>{name}</span>
      <span css={tagCss} style={{ color: tag.color, background: tag.bg }}>{statusLabel}</span>
    </div>
  )
}

const containerCss = css`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const nameCss = css`
  font-size: 0.7em;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
`

const tagCss = css`
  position: absolute;
  bottom: 0.4em;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.55em;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.15em 0.5em;
  border-radius: 0.25em;
  white-space: nowrap;
`
