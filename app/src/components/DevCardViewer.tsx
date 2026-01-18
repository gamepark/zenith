/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialComponent, usePlay } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp
import { Agent } from '@gamepark/zenith/material/Agent'
import { Agents } from '@gamepark/zenith/material/Agents'
import { Faction } from '@gamepark/zenith/material/Faction'
import { Influence } from '@gamepark/zenith/material/Influence'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { FC, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AgentCardHelpContent } from '../material/AgentCardHelp'
import { CursorTooltip } from './CursorTooltip'

type FilterState = {
  faction: Faction | null
  influence: Influence | null
}

type SortOption = 'id' | 'cost' | 'faction' | 'planet'

export const DevCardViewer: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({ faction: null, influence: null })
  const [sortBy, setSortBy] = useState<SortOption>('id')
  const [cardScale, setCardScale] = useState(1)
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const play = usePlay()

  const root = document.getElementById('root')
  if (!root) return null

  // Get all agents
  const allAgents = Object.keys(Agents).map(Number) as Agent[]

  // Filter agents
  const filteredAgents = allAgents
    .filter((agent) => {
      const data = Agents[agent]
      if (filters.faction !== null && data.faction !== filters.faction) return false
      if (filters.influence !== null && data.influence !== filters.influence) return false
      return true
    })
    .sort((a, b) => {
      const dataA = Agents[a]
      const dataB = Agents[b]
      switch (sortBy) {
        case 'cost':
          return dataA.cost - dataB.cost
        case 'faction':
          return dataA.faction - dataB.faction
        case 'planet':
          return dataA.influence - dataB.influence
        default:
          return a - b
      }
    })

  const handleMouseEnter = (agent: Agent, e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY })

    // If tooltip is already showing, update immediately
    if (hoveredAgent !== null) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      setHoveredAgent(agent)
      return
    }

    // Otherwise, wait before showing
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAgent(agent)
    }, 300)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setHoveredAgent(null)
  }

  const handleClick = (agent: Agent) => {
    play(displayMaterialHelp(MaterialType.AgentCard, { id: agent }), { transient: true })
  }

  const toggleButton = (
    <button css={toggleButtonCss} onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? 'X' : 'Cards'}
    </button>
  )

  if (!isOpen) {
    return createPortal(toggleButton, root)
  }

  // Card base size (matching AgentCardDescription: 5.8 x 8.9)
  const baseWidth = 5.8
  const baseHeight = 8.9
  const scaleFactor = 25 * cardScale // em to px ratio
  const cardWidth = baseWidth * scaleFactor
  const cardHeight = baseHeight * scaleFactor

  return createPortal(
    <>
      {toggleButton}
      <div css={overlayContainerCss}>
        <div css={panelCss}>
          <div css={headerCss}>
            <h2 css={titleCss}>All Cards ({filteredAgents.length})</h2>
            <div css={filtersCss}>
              <select
                value={filters.faction ?? ''}
                onChange={(e) => setFilters({ ...filters, faction: e.target.value ? Number(e.target.value) : null })}
                css={selectCss}
              >
                <option value="">All Factions</option>
                <option value={Faction.Animod}>Animod</option>
                <option value={Faction.Human}>Human</option>
                <option value={Faction.Robot}>Robot</option>
              </select>
              <select
                value={filters.influence ?? ''}
                onChange={(e) => setFilters({ ...filters, influence: e.target.value ? Number(e.target.value) : null })}
                css={selectCss}
              >
                <option value="">All Planets</option>
                <option value={Influence.Mercury}>Mercury</option>
                <option value={Influence.Venus}>Venus</option>
                <option value={Influence.Terra}>Terra</option>
                <option value={Influence.Mars}>Mars</option>
                <option value={Influence.Jupiter}>Jupiter</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} css={selectCss}>
                <option value="id">Sort: ID</option>
                <option value="cost">Sort: Cost</option>
                <option value="faction">Sort: Faction</option>
                <option value="planet">Sort: Planet</option>
              </select>
              <div css={sliderContainerCss}>
                <span>x{cardScale.toFixed(1)}</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={cardScale}
                  onChange={(e) => setCardScale(parseFloat(e.target.value))}
                  css={sliderCss}
                />
              </div>
            </div>
          </div>
          <div css={gridCss}>
            {filteredAgents.map((agent) => {
              const fontSize = cardWidth / baseWidth
              return (
                <div
                  key={agent}
                  css={cardContainerCss}
                  style={{ width: cardWidth, height: cardHeight, fontSize }}
                  onMouseEnter={(e) => handleMouseEnter(agent, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(agent)}
                >
                  <MaterialComponent type={MaterialType.AgentCard} itemId={agent} css={materialComponentCss} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Hover preview */}
        {hoveredAgent !== null && (
          <CursorTooltip cursor={cursor} offset={100} css={previewContainerCss}>
            <AgentCardHelpContent agentId={hoveredAgent} compact />
          </CursorTooltip>
        )}
      </div>
    </>,
    root
  )
}

const toggleButtonCss = css`
  position: fixed;
  top: calc(50% + 3em);
  left: 1em;
  z-index: 100;
  padding: 0.5em 1em;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5em;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;

  &:hover {
    background: #2563eb;
  }
`

const overlayContainerCss = css`
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
`

const panelCss = css`
  background: white;
  border-radius: 1em;
  width: 80vw;
  height: 95vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const headerCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`

const titleCss = css`
  margin: 0;
  font-size: 1.5em;
  color: #1e293b;
`

const filtersCss = css`
  display: flex;
  gap: 0.5em;
`

const selectCss = css`
  padding: 0.5em;
  border: 1px solid #d1d5db;
  border-radius: 0.25em;
  font-size: 14px;
`

const sliderContainerCss = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 14px;
  font-weight: 500;
`

const sliderCss = css`
  width: 100px;
  cursor: pointer;
`

const gridCss = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5em;
  padding: 1.5em;
  overflow-y: auto;
  align-content: flex-start;
`

const cardContainerCss = css`
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`

const materialComponentCss = css`
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  transform: none !important;
`

const previewContainerCss = css`
  font-size: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`
