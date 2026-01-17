/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useMaterialContext, useRules } from '@gamepark/react-game'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { getMyTeamColor } from '../locators/position.utils'
import Mercury from '../images/planet/Mercury.png'
import Venus from '../images/planet/Venus.png'
import Terra from '../images/planet/Terra.png'
import Mars from '../images/planet/Mars.png'
import Jupiter from '../images/planet/Jupiter.png'
import { uniqBy } from 'es-toolkit/compat'

const planetImages: Record<Influence, string> = {
  [Influence.Mercury]: Mercury,
  [Influence.Venus]: Venus,
  [Influence.Terra]: Terra,
  [Influence.Mars]: Mars,
  [Influence.Jupiter]: Jupiter
}

export const VictoryProgressPanel = () => {
  const root = document.getElementById('root')
  const rules = useRules<ZenithRules>()
  const context = useMaterialContext()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!root || !rules) return null

  const myTeam = getMyTeamColor(context)
  const opponentTeam = myTeam === TeamColor.White ? TeamColor.Black : TeamColor.White

  const getTeamStats = (team: TeamColor) => {
    const planets = rules.material(MaterialType.InfluenceDisc).location(LocationType.TeamPlanets).player(team).getItems()

    const total = planets.length
    const differentPlanets = uniqBy(planets, (item) => item.id).length

    const counts: Record<Influence, number> = {
      [Influence.Mercury]: 0,
      [Influence.Venus]: 0,
      [Influence.Terra]: 0,
      [Influence.Mars]: 0,
      [Influence.Jupiter]: 0
    }
    planets.forEach((p) => {
      if (p.id) counts[p.id as Influence]++
    })

    const maxSamePlanet = Math.max(...Object.values(counts), 0)

    return { total, differentPlanets, maxSamePlanet, counts }
  }

  const myStats = getTeamStats(myTeam)
  const opponentStats = getTeamStats(opponentTeam)

  if (!isExpanded) {
    return createPortal(
      <div css={collapsedContainerCss} onClick={() => setIsExpanded(true)}>
        <CollapsedTeamProgress team={opponentTeam} stats={opponentStats} />
        <div css={toggleButtonCss}>◀</div>
        <CollapsedTeamProgress team={myTeam} stats={myStats} />
      </div>,
      root
    )
  }

  return createPortal(
    <div css={panelContainerCss} onClick={() => setIsExpanded(false)}>
      <TeamProgress team={opponentTeam} stats={opponentStats} />
      <div css={toggleButtonCss}>▶</div>
      <TeamProgress team={myTeam} stats={myStats} isMe />
    </div>,
    root
  )
}

type TeamStats = {
  total: number
  differentPlanets: number
  maxSamePlanet: number
  counts: Record<Influence, number>
}

type TeamProgressProps = {
  team: TeamColor
  stats: TeamStats
  isMe?: boolean
}

const CollapsedTeamProgress = ({ team, stats }: { team: TeamColor; stats: TeamStats }) => {
  const { counts } = stats

  return (
    <div css={[collapsedTeamCss, team === TeamColor.White ? whiteTeamCss : blackTeamCss]}>
      {Object.entries(counts).map(([influence, count]) => (
        <div key={influence} css={collapsedPlanetRowCss}>
          <img src={planetImages[Number(influence) as Influence]} alt="" css={collapsedPlanetIconCss} />
          <span css={collapsedCountCss}>{count}</span>
        </div>
      ))}
    </div>
  )
}

const TeamProgress = ({ team, stats, isMe }: TeamProgressProps) => {
  const { total, differentPlanets, maxSamePlanet, counts } = stats

  const hasAbsolute = maxSamePlanet >= 3
  const hasDemocratic = differentPlanets >= 4
  const hasPopular = total >= 5

  return (
    <div css={[teamProgressCss, isMe ? myTeamCss : opponentTeamCss, team === TeamColor.White ? whiteTeamCss : blackTeamCss]}>
      <div css={teamLabelCss}>{isMe ? 'Vous' : 'Adversaire'}</div>
      <div css={victoryRowCss}>
        <span css={labelCss} title="3 disques sur la même planète">
          3=
        </span>
        <div css={progressBarContainerCss}>
          <div css={[progressBarCss, hasAbsolute && winCss]} style={{ width: `${(maxSamePlanet / 3) * 100}%` }} />
        </div>
        <span css={countCss}>{maxSamePlanet}/3</span>
      </div>
      <div css={victoryRowCss}>
        <span css={labelCss} title="4 planètes différentes">
          4≠
        </span>
        <div css={progressBarContainerCss}>
          <div css={[progressBarCss, hasDemocratic && winCss]} style={{ width: `${(differentPlanets / 4) * 100}%` }} />
        </div>
        <span css={countCss}>{differentPlanets}/4</span>
      </div>
      <div css={victoryRowCss}>
        <span css={labelCss} title="5 disques au total">
          5
        </span>
        <div css={progressBarContainerCss}>
          <div css={[progressBarCss, hasPopular && winCss]} style={{ width: `${(total / 5) * 100}%` }} />
        </div>
        <span css={countCss}>{total}/5</span>
      </div>
      <div css={planetsRowCss}>
        {Object.entries(counts).map(([influence, count]) => (
          <div key={influence} css={planetCountCss}>
            <img src={planetImages[Number(influence) as Influence]} alt="" css={planetIconCss} />
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Collapsed state styles
const collapsedContainerCss = css`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.2em;
  font-size: 1.3em;
  cursor: pointer;
  animation: slideInCollapsed 0.3s ease-out;

  @keyframes slideInCollapsed {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(2em);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }
`

const collapsedTeamCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  padding: 0.8em 1em;
  border-radius: 0.5em;
`

const collapsedPlanetRowCss = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
`

const collapsedPlanetIconCss = css`
  width: 1.8em;
  height: 1.6em;
  border-radius: 0.9em / 0.75em;
  object-fit: cover;
`

const collapsedCountCss = css`
  font-size: 1.1em;
  font-weight: bold;
  min-width: 1em;
`

const toggleButtonCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.4em 0.8em;
  height: 2.5em;
  border-radius: 0.4em;
  cursor: pointer;
  transition: background 0.2s;
  align-self: stretch;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`

// Expanded state styles
const panelContainerCss = css`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.2em;
  font-size: 1.3em;
  cursor: pointer;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(2em);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }
`

const teamProgressCss = css`
  padding: 1.2em 1.5em;
  border-radius: 0.8em;
  min-width: 18em;
`

const teamLabelCss = css`
  font-weight: bold;
  margin-bottom: 0.5em;
  font-size: 0.9em;
  opacity: 0.8;
`

const myTeamCss = css``
const opponentTeamCss = css`
  opacity: 0.85;
`

const whiteTeamCss = css`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.9) 100%);
  border: 2px solid rgba(200, 200, 200, 0.8);
  color: #333;
`

const blackTeamCss = css`
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #555;
  color: #e0e0e0;
`

const victoryRowCss = css`
  display: flex;
  align-items: center;
  gap: 0.6em;
  margin-bottom: 0.5em;
`

const labelCss = css`
  font-weight: bold;
  width: 2.2em;
  text-align: center;
  font-size: 1em;
  cursor: help;
`

const progressBarContainerCss = css`
  flex: 1;
  height: 0.8em;
  background: rgba(128, 128, 128, 0.3);
  border-radius: 0.4em;
  overflow: hidden;
`

const progressBarCss = css`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 0.4em;
  transition: width 0.3s ease;
`

const winCss = css`
  background: linear-gradient(90deg, #22c55e, #4ade80);
`

const countCss = css`
  font-size: 0.9em;
  width: 2.5em;
  text-align: right;
  font-weight: 500;
`

const planetsRowCss = css`
  display: flex;
  justify-content: space-between;
  margin-top: 0.6em;
  padding-top: 0.6em;
  border-top: 1px solid rgba(128, 128, 128, 0.3);
`

const planetCountCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3em;
  font-size: 0.9em;
  font-weight: 500;
`

const planetIconCss = css`
  width: 2.6em;
  height: 2.35em;
  border-radius: 1.3em / 1.1em;
  object-fit: cover;
`
