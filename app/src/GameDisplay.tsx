/** @jsxImportSource @emotion/react */
import { pointerWithin } from '@dnd-kit/core'
import { css } from '@emotion/react'
import { DevToolEntry, DevToolsHub, GameTable, GameTableNavigation } from '@gamepark/react-game'
import { FC, useState } from 'react'
import { AgentCardHoverPreview } from './components/AgentCardHoverPreview'
import { SecretAgentInfoDialog } from './components/SecretAgentInfoDialog'
import { DevCardViewer } from './components/DevCardViewer'
import { ExtensionDialogContext, useExtensionDialog } from './ExtensionContext'
import { PlayerPanels } from './panels/PlayerPanels'
import { VictoryProgressPanel } from './panels/VictoryProgressPanel'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = () => {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  const { show, dismiss, reopen } = useExtensionDialog()

  return (
    <ExtensionDialogContext.Provider value={reopen}>
      <GameTable
        verticalCenter
        collisionAlgorithm={pointerWithin}
        xMin={-53}
        xMax={47}
        yMin={-24}
        yMax={27}
        margin={margin}
        css={process.env.NODE_ENV === 'development' && tableBorder}
      >
        <GameTableNavigation css={navigationCss} />
        <PlayerPanels />
        <VictoryProgressPanel />
        {process.env.NODE_ENV === 'development' && <ZenithDevTools />}
      </GameTable>
      <AgentCardHoverPreview />
      {show && <SecretAgentInfoDialog onClose={dismiss} />}
    </ExtensionDialogContext.Provider>
  )
}

const ZenithDevTools: FC = () => {
  const [showCards, setShowCards] = useState(false)
  if (showCards) return <DevCardViewer onClose={() => setShowCards(false)} />
  return (
    <DevToolsHub fabBottom="calc(1em + 6em * 1.7)">
      <DevToolEntry icon={'\u2726'} label="Card Viewer" desc="Browse & validate agents" onClick={() => setShowCards(true)} />
    </DevToolsHub>
  )
}

const navigationCss = css`
  top: auto;
  bottom: calc(1em + 6em * 1.7);
  left: ${process.env.NODE_ENV === 'development' ? '5em' : '1em'};
  gap: 0.4em;
  z-index: 100;

  button {
    font-size: calc(2.3em * var(--gp-scale, 1)) !important;
    width: 2em !important;
    height: 2em !important;
    border-radius: 0.5em !important;
    border: 0.06em solid rgba(212, 135, 42, 0.4) !important;
    background: linear-gradient(145deg, #1c1810, #2a2014) !important;
    color: #d4872a !important;
    filter: none !important;
    transition: all 0.15s !important;
    box-shadow: 0 0.12em 0.5em rgba(0, 0, 0, 0.3);

    &:not(:disabled):hover {
      background: linear-gradient(145deg, #2a2014, #3a2c1a) !important;
      border-color: rgba(212, 135, 42, 0.7) !important;
      transform: none !important;
    }

    &:not(:disabled):active {
      background: rgba(212, 135, 42, 0.2) !important;
      transform: none !important;
    }

    &:disabled {
      color: #5a4d3a !important;
      border-color: rgba(212, 135, 42, 0.15) !important;
      opacity: 0.6;
    }
  }
`

const tableBorder = css`
  border: 1px solid white;
`
