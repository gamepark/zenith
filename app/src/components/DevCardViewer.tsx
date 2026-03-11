/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { MaterialComponent, usePlay } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp
import { Agent } from '@gamepark/zenith/material/Agent'
import { AgentCharacteristics, Agents } from '@gamepark/zenith/material/Agents'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Faction } from '@gamepark/zenith/material/Faction'
import { Influence } from '@gamepark/zenith/material/Influence'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { FC, useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { getColorForInfluence } from '../i18n/trans.components'
import { AgentCardHelpContent } from '../material/AgentCardHelp'
import { EffectText } from './EffectText'
import { CursorTooltip } from './CursorTooltip'

const STORAGE_KEY = 'zenith-validated-agents'

const loadValidated = (): Set<Agent> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as Agent[]) : new Set()
  } catch {
    return new Set()
  }
}

const saveValidated = (set: Set<Agent>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

const factionLabels: Record<Faction, string> = {
  [Faction.Animod]: 'Animod',
  [Faction.Human]: 'Human',
  [Faction.Robot]: 'Robot'
}

const planetLabels: Record<Influence, string> = {
  [Influence.Mercury]: 'Mercury',
  [Influence.Venus]: 'Venus',
  [Influence.Terra]: 'Terra',
  [Influence.Mars]: 'Mars',
  [Influence.Jupiter]: 'Jupiter'
}

const factionColors: Record<Faction, string> = {
  [Faction.Animod]: '#4ade80',
  [Faction.Human]: '#60a5fa',
  [Faction.Robot]: '#f472b6'
}

const effectLabels: Partial<Record<EffectType, string>> = {
  [EffectType.Transfer]: 'Transfer',
  [EffectType.GiveCredit]: 'Give Credit',
  [EffectType.WinCredit]: 'Win Credit',
  [EffectType.SpendCredit]: 'Spend Credit',
  [EffectType.Conditional]: 'Conditional',
  [EffectType.WinZenithium]: 'Win Zenithium',
  [EffectType.GiveZenithium]: 'Give Zenithium',
  [EffectType.Exile]: 'Exile',
  [EffectType.WinInfluence]: 'Win Influence',
  [EffectType.GiveInfluence]: 'Give Influence',
  [EffectType.ResetInfluence]: 'Reset Influence',
  [EffectType.DevelopTechnology]: 'Develop Tech',
  [EffectType.GiveLeaderBadge]: 'Give Leader',
  [EffectType.TakeLeaderBadge]: 'Take Leader',
  [EffectType.Discard]: 'Discard',
  [EffectType.Mobilize]: 'Mobilize',
  [EffectType.Choice]: 'Choice',
  [EffectType.TakeBonus]: 'Take Bonus',
  [EffectType.StealCredit]: 'Steal Credit',
  [EffectType.SpendZenithium]: 'Spend Zenithium',
  [EffectType.TakeTechnologyBonusToken]: 'Take Tech Token',
  [EffectType.ShareCard]: 'Share Card'
}

type SortOption = 'id' | 'cost' | 'faction' | 'planet' | 'name'
type ValidationFilter = 'all' | 'validated' | 'unvalidated'

const hasEffectType = (data: AgentCharacteristics, type: EffectType): boolean => {
  return data.effects.some(e => {
    if (e.type === type) return true
    if (e.type === EffectType.Conditional) {
      if (e.effect.type === type) return true
      const cond = e.condition
      if ('effect' in cond && cond.effect.type === type) return true
    }
    if (e.type === EffectType.Choice) {
      if (e.left.type === type || e.right.type === type) return true
    }
    return false
  })
}

const CardEffects: FC<{ agent: Agent }> = ({ agent }) => {
  const data = Agents[agent]
  return (
    <div css={effectsListCss}>
      {data.effects.map((effect, i) => (
        <div key={i} css={effectLineCss}>
          <span css={effectBulletCss} />
          <span><EffectText effect={effect} /></span>
        </div>
      ))}
    </div>
  )
}

export const DevCardViewer: FC = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [factionFilter, setFactionFilter] = useState<Faction | 0>(0)
  const [planetFilter, setPlanetFilter] = useState<Influence | 0>(0)
  const [costFilter, setCostFilter] = useState<number | -1>(-1)
  const [effectFilter, setEffectFilter] = useState<EffectType | -1>(-1)
  const [validationFilter, setValidationFilter] = useState<ValidationFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('id')
  const [cardScale, setCardScale] = useState(1)
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [validated, setValidated] = useState<Set<Agent>>(loadValidated)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const play = usePlay()

  const allAgents = useMemo(() => Object.keys(Agents).map(Number) as Agent[], [])
  const allCosts = useMemo(() => [...new Set(allAgents.map(a => Agents[a].cost))].sort((a, b) => a - b), [allAgents])

  const filteredAgents = useMemo(() => {
    return allAgents
      .filter(agent => {
        const data = Agents[agent]
        if (factionFilter && data.faction !== factionFilter) return false
        if (planetFilter && data.influence !== planetFilter) return false
        if (costFilter !== -1 && data.cost !== costFilter) return false
        if (effectFilter !== -1 && !hasEffectType(data, effectFilter)) return false
        if (validationFilter === 'validated' && !validated.has(agent)) return false
        if (validationFilter === 'unvalidated' && validated.has(agent)) return false
        if (search) {
          const name = t(`agent.${agent}`).toLowerCase()
          if (!name.includes(search.toLowerCase())) return false
        }
        return true
      })
      .sort((a, b) => {
        const da = Agents[a], db = Agents[b]
        switch (sortBy) {
          case 'cost': return da.cost - db.cost || a - b
          case 'faction': return da.faction - db.faction || a - b
          case 'planet': return da.influence - db.influence || a - b
          case 'name': return t(`agent.${a}`).localeCompare(t(`agent.${b}`))
          default: return a - b
        }
      })
  }, [allAgents, factionFilter, planetFilter, costFilter, effectFilter, validationFilter, validated, search, sortBy, t])

  const toggleValidation = useCallback((agent: Agent) => {
    setValidated(prev => {
      const next = new Set(prev)
      if (next.has(agent)) next.delete(agent)
      else next.add(agent)
      saveValidated(next)
      return next
    })
  }, [])

  const handleMouseEnter = useCallback((agent: Agent, e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY })
    if (hoveredAgent !== null) {
      if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null }
      setHoveredAgent(agent)
      return
    }
    hoverTimeoutRef.current = setTimeout(() => setHoveredAgent(agent), 300)
  }, [hoveredAgent])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null }
    setHoveredAgent(null)
  }, [])

  const handleClick = useCallback((agent: Agent) => {
    play(displayMaterialHelp(MaterialType.AgentCard, { id: agent }), { transient: true })
  }, [play])

  const handleContextMenu = useCallback((agent: Agent, e: React.MouseEvent) => {
    e.preventDefault()
    toggleValidation(agent)
  }, [toggleValidation])

  const resetFilters = useCallback(() => {
    setSearch(''); setFactionFilter(0); setPlanetFilter(0)
    setCostFilter(-1); setEffectFilter(-1); setValidationFilter('all')
  }, [])

  const root = document.getElementById('root')
  if (!root) return null

  const validatedCount = validated.size

  if (!isOpen) {
    return createPortal(
      <button css={fabCss} onClick={() => setIsOpen(true)}>
        <span css={fabIconCss}>{'\u2726'}</span>
        <span>Cards</span>
        {validatedCount > 0 && (
          <span css={fabBadgeCss}>{validatedCount}/{allAgents.length}</span>
        )}
      </button>,
      root
    )
  }

  const imgSize = 130 * cardScale

  return createPortal(
    <div css={overlayCss}>
      <div css={bgPatternCss} />

      <div css={contentCss}>
        {/* Sticky header */}
        <div css={commandBarCss}>
          <div css={commandTopCss}>
            <div css={titleBlockCss}>
              <span css={titleGlyphCss}>{'\u2726'}</span>
              <h2 css={titleTextCss}>Agent Archive</h2>
              <span css={counterChipCss}>{filteredAgents.length} / {allAgents.length}</span>
              {validatedCount > 0 && (
                <span css={validatedChipCss}>{validatedCount} OK</span>
              )}
            </div>
            <div css={commandRightCss}>
              <label css={scaleLabelCss}>
                <span>{'\u25C7'} {(cardScale * 100).toFixed(0)}%</span>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={cardScale}
                  onChange={e => setCardScale(parseFloat(e.target.value))}
                  css={rangeInputCss}
                />
              </label>
              <button css={closeXCss} onClick={() => setIsOpen(false)}>&times;</button>
            </div>
          </div>

          <div css={filterBarCss}>
            <input
              type="text" placeholder="Search agent..."
              value={search} onChange={e => setSearch(e.target.value)}
              css={searchCss}
            />
            <select value={factionFilter} onChange={e => setFactionFilter(Number(e.target.value) as Faction | 0)} css={selectCss}>
              <option value={0}>Faction</option>
              {Object.entries(factionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={planetFilter} onChange={e => setPlanetFilter(Number(e.target.value) as Influence | 0)} css={selectCss}>
              <option value={0}>Planet</option>
              {Object.entries(planetLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={costFilter} onChange={e => setCostFilter(Number(e.target.value))} css={selectCss}>
              <option value={-1}>Cost</option>
              {allCosts.map(c => <option key={c} value={c}>{c} cr.</option>)}
            </select>
            <select value={effectFilter} onChange={e => setEffectFilter(Number(e.target.value))} css={selectCss}>
              <option value={-1}>Effect</option>
              {Object.entries(effectLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} css={selectCss}>
              <option value="id">Sort: ID</option>
              <option value="name">Sort: Name</option>
              <option value="cost">Sort: Cost</option>
              <option value="faction">Sort: Faction</option>
              <option value="planet">Sort: Planet</option>
            </select>
            <select value={validationFilter} onChange={e => setValidationFilter(e.target.value as ValidationFilter)} css={selectCss}>
              <option value="all">All</option>
              <option value="validated">Validated</option>
              <option value="unvalidated">Todo</option>
            </select>
            <button css={resetCss} onClick={resetFilters}>Reset</button>
          </div>

          <div css={hintBarCss}>Right-click to toggle validation</div>
        </div>

        {/* Card grid */}
        <div css={gridCss}>
          {filteredAgents.map(agent => {
            const data = Agents[agent]
            const isOk = validated.has(agent)
            const planetColor = getColorForInfluence(data.influence) ?? '#d4872a'
            return (
              <div
                key={agent}
                css={[tileCss, isOk && tileOkCss]}
                onContextMenu={e => handleContextMenu(agent, e)}
              >
                <div css={tileAccentCss} style={{ background: planetColor }} />
                <div css={tileBodyCss}>
                  <div
                    css={cardThumbCss}
                    style={{ width: imgSize, height: imgSize * (8.9 / 5.8), fontSize: imgSize / 5.8 }}
                    onClick={() => handleClick(agent)}
                    onMouseEnter={e => handleMouseEnter(agent, e)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <MaterialComponent type={MaterialType.AgentCard} itemId={agent} css={matCss} />
                    {isOk && (
                      <div css={sealOverlayCss}>
                        <div css={sealCss}>{'\u2713'}</div>
                      </div>
                    )}
                  </div>

                  <div css={infoPanelCss}>
                    <div css={agentNameCss} onClick={() => handleClick(agent)}>
                      {t(`agent.${agent}`)}
                    </div>
                    <div css={tagRowCss}>
                      <span css={tagCss} style={{ color: factionColors[data.faction], borderColor: factionColors[data.faction] + '55' }}>
                        {factionLabels[data.faction]}
                      </span>
                      <span css={tagCss} style={{ color: planetColor, borderColor: planetColor + '55' }}>
                        {planetLabels[data.influence]}
                      </span>
                      <span css={costTagCss}>{data.cost} cr.</span>
                    </div>
                    <CardEffects agent={agent} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div css={emptyCss}>No agents match current filters.</div>
        )}
      </div>

      {hoveredAgent !== null && (
        <CursorTooltip cursor={cursor} offset={100} css={tooltipCss}>
          <AgentCardHelpContent agentId={hoveredAgent} compact />
        </CursorTooltip>
      )}
    </div>,
    root
  )
}

// ═══════════════════════════════════════════
//  Styles
// ═══════════════════════════════════════════

const fabPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 135, 42, 0.3); }
  50% { box-shadow: 0 0 0 6px rgba(212, 135, 42, 0); }
`

const fabCss = css`
  position: fixed;
  top: calc(50% + 3em);
  left: 12px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #f1e0c5;
  background: linear-gradient(145deg, #1c1810 0%, #2a2014 100%);
  border: 1px solid rgba(212, 135, 42, 0.35);
  border-radius: 6px;
  cursor: pointer;
  animation: ${fabPulse} 3s ease-in-out infinite;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: linear-gradient(145deg, #2a2014 0%, #3a2c1a 100%);
    border-color: rgba(212, 135, 42, 0.6);
    animation: none;
  }
`

const fabIconCss = css`
  color: #d4872a;
  font-size: 14px;
`

const fabBadgeCss = css`
  font-size: 10px;
  padding: 1px 7px;
  border-radius: 99px;
  background: #059669;
  color: #fff;
  font-weight: 800;
`

// ── Overlay & background ──

const overlayCss = css`
  position: fixed;
  inset: 0;
  z-index: 99;
  overflow-y: auto;
  overflow-x: hidden;
  background: #0c0e14;
`

const bgPatternCss = css`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
  background:
    radial-gradient(ellipse 80% 50% at 20% 10%, rgba(212, 135, 42, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 90%, rgba(212, 135, 42, 0.04) 0%, transparent 60%),
    repeating-linear-gradient(
      0deg, transparent, transparent 60px,
      rgba(212, 135, 42, 0.025) 60px, rgba(212, 135, 42, 0.025) 61px
    ),
    repeating-linear-gradient(
      90deg, transparent, transparent 60px,
      rgba(212, 135, 42, 0.02) 60px, rgba(212, 135, 42, 0.02) 61px
    );
`

const contentCss = css`
  position: relative;
  z-index: 1;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 24px 60px;
`

// ── Command bar (sticky, beige) ──

const commandBarCss = css`
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 18px 16px 14px;
  background: linear-gradient(180deg, #ede4d3 0%, #e8ddc8 100%);
  border-bottom: 2px solid rgba(212, 135, 42, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

const commandTopCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const titleBlockCss = css`
  display: flex;
  align-items: center;
  gap: 10px;
`

const titleGlyphCss = css`
  color: #d4872a;
  font-size: 26px;
`

const titleTextCss = css`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #3e3020;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

const counterChipCss = css`
  font-size: 14px;
  color: #8a7a65;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const validatedChipCss = css`
  font-size: 13px;
  padding: 3px 10px;
  border-radius: 99px;
  background: rgba(5, 150, 105, 0.15);
  color: #059669;
  font-weight: 700;
`

const commandRightCss = css`
  display: flex;
  align-items: center;
  gap: 14px;
`

const scaleLabelCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b5d4a;
  font-weight: 600;
  cursor: default;
`

const rangeInputCss = css`
  width: 100px;
  cursor: pointer;
  accent-color: #d4872a;
`

const closeXCss = css`
  background: none;
  border: none;
  font-size: 30px;
  color: #8a7a65;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  transition: color 0.15s;
  &:hover { color: #ef4444; }
`

// ── Filters ──

const filterBarCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`

const inputBase = css`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid rgba(180, 160, 130, 0.4);
  background: #faf6ef;
  color: #3e3020;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus { outline: none; border-color: #d4872a; box-shadow: 0 0 0 2px rgba(212, 135, 42, 0.15); }
`

const searchCss = css`
  ${inputBase};
  width: 200px;
  &::placeholder { color: #a0927e; }
`

const selectCss = css`
  ${inputBase};
  cursor: pointer;
`

const resetCss = css`
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid rgba(212, 135, 42, 0.35);
  background: rgba(212, 135, 42, 0.12);
  color: #d4872a;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.15s;
  &:hover { background: rgba(212, 135, 42, 0.22); border-color: rgba(212, 135, 42, 0.5); }
`

const hintBarCss = css`
  margin-top: 8px;
  font-size: 12px;
  color: #8a7a65;
  letter-spacing: 0.02em;
`

// ── Grid ──

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 14px;
  padding-top: 20px;
`

// ── Tile ──

const tileCss = css`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(160deg, #f5ede0 0%, #ede4d3 50%, #e8dcc8 100%);
  border: 1px solid rgba(180, 160, 130, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  &:hover {
    border-color: rgba(212, 135, 42, 0.4);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
    transform: translateY(-1px);
  }
`

const tileOkCss = css`
  border-color: rgba(5, 150, 105, 0.5);
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15), 0 2px 8px rgba(0, 0, 0, 0.15);
  &:hover {
    border-color: rgba(5, 150, 105, 0.7);
    box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2), 0 6px 24px rgba(0, 0, 0, 0.25);
  }
`

const tileBodyCss = css`
  display: flex;
  gap: 14px;
  padding: 12px;
`

// ── Card thumbnail ──

const cardThumbCss = css`
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.15s;
  &:hover { transform: scale(1.03); }
`

const matCss = css`
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  transform: none !important;
`

// ── Seal ──

const sealPop = keyframes`
  0% { transform: scale(0) rotate(-20deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`

const sealOverlayCss = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const sealCss = css`
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
  border: 0.15em solid rgba(5, 150, 105, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  font-weight: 900;
  color: #fff;
  background: rgba(5, 150, 105, 0.55);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  animation: ${sealPop} 0.3s ease-out;
`

// ── Tile accent bar ──

const tileAccentCss = css`
  height: 4px;
  width: 100%;
`

// ── Info panel ──

const infoPanelCss = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
`

const agentNameCss = css`
  font-size: 16px;
  font-weight: 800;
  color: #3e3020;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover { color: #d4872a; }
`

const tagRowCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`

const tagCss = css`
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

const costTagCss = css`
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  color: #d4872a;
  border: 1px solid rgba(212, 135, 42, 0.35);
  background: rgba(212, 135, 42, 0.08);
`

// ── Effects list ──

const effectsListCss = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 3px;
`

const effectLineCss = css`
  display: flex;
  align-items: baseline;
  gap: 7px;
  font-size: 13px;
  color: #3e3020;
  line-height: 1.55;
`

const effectBulletCss = css`
  flex-shrink: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #d4872a;
  margin-top: 0.5em;
`

// ── Tooltip ──

const tooltipCss = css`
  font-size: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`

// ── Empty state ──

const emptyCss = css`
  text-align: center;
  padding: 60px 20px;
  color: #8a7a65;
  font-size: 15px;
  font-style: italic;
`
