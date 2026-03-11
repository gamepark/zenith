/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { useGame, usePlayerId } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { FC, useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DevCardViewer } from './DevCardViewer'

declare const game: {
  new(): void
  undo(count?: number): void
  changePlayer(playerId?: number): void
  bot(start?: boolean): void
  monkeyOpponents(start?: boolean): void
} | undefined

const TOOLS = [
  { id: 'cards', icon: '\u2726', label: 'Card Viewer', desc: 'Browse & validate agents' },
  { id: 'new', icon: '\u21BB', label: 'New Game', desc: 'Reset game state' },
  { id: 'undo', icon: '\u238C', label: 'Undo', desc: 'Revert N moves' },
  { id: 'player', icon: '\u2194', label: 'Switch Player', desc: 'View as another player' },
  { id: 'bot', icon: '\u2699', label: 'Bot Move', desc: 'Play one bot move' },
  { id: 'monkey', icon: '\u2689', label: 'Monkey', desc: 'Toggle random opponent' },
  { id: 'copy-state', icon: '\u2398', label: 'Copy State', desc: 'Copy game state to clipboard' },
  { id: 'copy-ls', icon: '\u29C9', label: 'Copy LocalStorage', desc: 'Copy localStorage to clipboard' }
] as const

type ToolId = typeof TOOLS[number]['id']

export const DevToolsHub: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showCardViewer, setShowCardViewer] = useState(false)
  const [undoCount, setUndoCount] = useState(1)
  const [monkeyActive, setMonkeyActive] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const flashTimeout = useRef<NodeJS.Timeout | null>(null)
  const gameState = useGame<MaterialGame>()
  const currentPlayer = usePlayerId()
  const players = gameState?.players?.map(p => p.id as number) ?? []

  const doFlash = useCallback((msg: string) => {
    if (flashTimeout.current) clearTimeout(flashTimeout.current)
    setFlash(msg)
    flashTimeout.current = setTimeout(() => setFlash(null), 1500)
  }, [])

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      doFlash(`${label} copied!`)
    } catch {
      doFlash('Copy failed')
    }
  }, [doFlash])

  const handleTool = useCallback((id: ToolId) => {
    switch (id) {
      case 'cards':
        setShowCardViewer(true)
        setIsOpen(false)
        return
      case 'copy-state':
        if (gameState) copyToClipboard(JSON.stringify(gameState, null, 2), 'Game state')
        else doFlash('No game state available')
        return
      case 'copy-ls': {
        const data: Record<string, string> = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) data[key] = localStorage.getItem(key) ?? ''
        }
        copyToClipboard(JSON.stringify(data, null, 2), 'localStorage')
        return
      }
      default:
        break
    }
    if (typeof game === 'undefined') {
      doFlash('game helper not available')
      return
    }
    switch (id) {
      case 'new':
        game.new()
        doFlash('New game started')
        return
      case 'undo':
        game.undo(undoCount)
        doFlash(`Undo ${undoCount} move${undoCount > 1 ? 's' : ''}`)
        return
      case 'player':
        return
      case 'bot':
        game.bot()
        doFlash('Bot move played')
        return
      case 'monkey': {
        const next = !monkeyActive
        game.monkeyOpponents(next)
        setMonkeyActive(next)
        doFlash(next ? 'Monkey ON' : 'Monkey OFF')
        return
      }
    }
  }, [undoCount, monkeyActive, doFlash, gameState, copyToClipboard])

  const root = document.getElementById('root')
  if (!root) return null

  if (showCardViewer) {
    return <DevCardViewer onClose={() => setShowCardViewer(false)} />
  }

  return createPortal(
    <>
      {/* FAB trigger */}
      <button css={fabCss} onClick={() => setIsOpen(o => !o)} data-open={isOpen}>
        <span css={fabGearCss} data-open={isOpen}>{'\u2726'}</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          <div css={backdropCss} onClick={() => setIsOpen(false)} />
          <div css={panelCss}>
            <div css={panelHeaderCss}>
              <span css={panelTitleCss}>Dev Tools</span>
              <span css={panelBadgeCss}>DEV</span>
            </div>

            <div css={toolGridCss}>
              {TOOLS.map((tool, i) => (
                <button
                  key={tool.id}
                  css={[
                    toolBtnCss,
                    tool.id === 'monkey' && monkeyActive && toolBtnActiveCss
                  ]}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => tool.id !== 'undo' && handleTool(tool.id as ToolId)}
                >
                  <span css={toolIconCss}>{tool.icon}</span>
                  <span css={toolLabelCss}>{tool.label}</span>
                  <span css={toolDescCss}>{tool.desc}</span>
                  {tool.id === 'monkey' && monkeyActive && (
                    <span css={activeIndicatorCss} />
                  )}
                  {tool.id === 'player' && (
                    <div css={undoRowCss} onClick={e => e.stopPropagation()}>
                      {players.map(pid => (
                        <button
                          key={pid}
                          css={[playerBtnCss, pid === currentPlayer && playerBtnActiveCss]}
                          onClick={() => {
                            if (typeof game !== 'undefined') {
                              game.changePlayer(pid)
                            }
                          }}
                        >P{pid}</button>
                      ))}
                      <button
                        css={[playerBtnCss, currentPlayer === undefined && playerBtnActiveCss]}
                        onClick={() => {
                          if (typeof game !== 'undefined') {
                            game.changePlayer()
                          }
                        }}
                      >Spect</button>
                    </div>
                  )}
                  {tool.id === 'undo' && (
                    <div css={undoRowCss} onClick={e => e.stopPropagation()}>
                      <button
                        css={undoStepBtnCss}
                        onClick={() => setUndoCount(c => Math.max(1, c - 1))}
                      >-</button>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={undoCount}
                        onChange={e => setUndoCount(Math.max(1, parseInt(e.target.value) || 1))}
                        css={undoInputCss}
                      />
                      <button
                        css={undoStepBtnCss}
                        onClick={() => setUndoCount(c => c + 1)}
                      >+</button>
                      <button
                        css={undoGoCss}
                        onClick={() => handleTool('undo')}
                      >Go</button>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {flash && <div css={flashCss}>{flash}</div>}
          </div>
        </>
      )}
    </>,
    root
  )
}

// ═══════════════════════════════════════
//  Styles
// ═══════════════════════════════════════

const fabPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 135, 42, 0.25); }
  50% { box-shadow: 0 0 0 5px rgba(212, 135, 42, 0); }
`

const fabCss = css`
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 9999;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(212, 135, 42, 0.4);
  background: linear-gradient(145deg, #1c1810, #2a2014);
  color: #d4872a;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fabPulse} 3s ease-in-out infinite;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(145deg, #2a2014, #3a2c1a);
    border-color: rgba(212, 135, 42, 0.7);
    animation: none;
  }

  &[data-open="true"] {
    animation: none;
    background: #d4872a;
    color: #1a1208;
    border-color: #d4872a;
  }
`

const fabGearCss = css`
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  &[data-open="true"] {
    transform: rotate(90deg);
  }
`

const backdropCss = css`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const panelCss = css`
  position: fixed;
  bottom: 64px;
  left: 16px;
  z-index: 9999;
  width: 320px;
  background: linear-gradient(170deg, #1e1a12 0%, #161210 100%);
  border: 1px solid rgba(212, 135, 42, 0.3);
  border-radius: 12px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
  animation: ${slideUp} 0.2s ease-out;
`

const panelHeaderCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(212, 135, 42, 0.15);
  background: rgba(212, 135, 42, 0.04);
`

const panelTitleCss = css`
  font-size: 13px;
  font-weight: 800;
  color: #e8d5b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const panelBadgeCss = css`
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(212, 135, 42, 0.2);
  color: #d4872a;
  letter-spacing: 0.1em;
`

const toolReveal = keyframes`
  from { opacity: 0; transform: translateX(-6px); }
  to { opacity: 1; transform: translateX(0); }
`

const toolGridCss = css`
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 2px;
`

const toolBtnCss = css`
  position: relative;
  display: grid;
  grid-template-columns: 28px 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 0 10px;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  animation: ${toolReveal} 0.25s ease-out backwards;

  &:hover {
    background: rgba(212, 135, 42, 0.08);
  }
  &:active {
    background: rgba(212, 135, 42, 0.14);
  }
`

const toolBtnActiveCss = css`
  background: rgba(212, 135, 42, 0.1);
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 8px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: #d4872a;
  }
`

const toolIconCss = css`
  grid-row: 1 / -1;
  font-size: 16px;
  color: #d4872a;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(212, 135, 42, 0.08);
`

const toolLabelCss = css`
  font-size: 13px;
  font-weight: 700;
  color: #e8d5b8;
  line-height: 1.2;
`

const toolDescCss = css`
  font-size: 11px;
  color: #8a7a65;
  line-height: 1.2;
`

const activeIndicatorCss = css`
  position: absolute;
  top: 10px;
  right: 12px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d4872a;
  box-shadow: 0 0 6px rgba(212, 135, 42, 0.5);
`

// ── Undo row ──

const undoRowCss = css`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
`

const undoStepBtnCss = css`
  width: 26px;
  height: 26px;
  border-radius: 5px;
  border: 1px solid rgba(212, 135, 42, 0.25);
  background: rgba(212, 135, 42, 0.06);
  color: #d4872a;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: rgba(212, 135, 42, 0.14);
    border-color: rgba(212, 135, 42, 0.4);
  }
`

const undoInputCss = css`
  width: 48px;
  height: 26px;
  border-radius: 5px;
  border: 1px solid rgba(212, 135, 42, 0.25);
  background: rgba(0, 0, 0, 0.3);
  color: #e8d5b8;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  font-variant-numeric: tabular-nums;

  &:focus {
    outline: none;
    border-color: #d4872a;
    box-shadow: 0 0 0 2px rgba(212, 135, 42, 0.15);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const undoGoCss = css`
  height: 26px;
  padding: 0 12px;
  border-radius: 5px;
  border: 1px solid rgba(212, 135, 42, 0.35);
  background: rgba(212, 135, 42, 0.15);
  color: #d4872a;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.15s;

  &:hover {
    background: rgba(212, 135, 42, 0.25);
    border-color: rgba(212, 135, 42, 0.5);
  }
`

// ── Player selector ──

const playerBtnCss = css`
  height: 26px;
  padding: 0 10px;
  border-radius: 5px;
  border: 1px solid rgba(212, 135, 42, 0.25);
  background: rgba(212, 135, 42, 0.06);
  color: #8a7a65;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(212, 135, 42, 0.14);
    border-color: rgba(212, 135, 42, 0.4);
    color: #e8d5b8;
  }
`

const playerBtnActiveCss = css`
  background: rgba(212, 135, 42, 0.2);
  border-color: #d4872a;
  color: #d4872a;
`

// ── Flash notification ──

const flashFade = keyframes`
  0% { opacity: 0; transform: translateY(4px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
`

const flashCss = css`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #d4872a;
  text-align: center;
  border-top: 1px solid rgba(212, 135, 42, 0.1);
  background: rgba(212, 135, 42, 0.04);
  animation: ${flashFade} 1.5s ease-out forwards;
`
