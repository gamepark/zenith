/** @jsxImportSource @emotion/react */
import { pointerWithin } from '@dnd-kit/core'
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { FC } from 'react'
import { AgentCardHoverPreview } from './components/AgentCardHoverPreview'
import { DevCardViewer } from './components/DevCardViewer'
import { PlayerPanels } from './panels/PlayerPanels'
import { VictoryProgressPanel } from './panels/VictoryProgressPanel'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = () => {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }

  return (
    <>
      <GameTable
        verticalCenter
        collisionAlgorithm={pointerWithin}
        xMin={-53}
        xMax={53}
        yMin={-28}
        yMax={28}
        margin={margin}
        css={process.env.NODE_ENV === 'development' && tableBorder}
      >
        <GameTableNavigation css={navigationCss} />
        <PlayerPanels />
        <VictoryProgressPanel />
        {process.env.NODE_ENV === 'development' && <DevCardViewer />}
      </GameTable>
      <AgentCardHoverPreview />
    </>
  )
}

const navigationCss = css`
  left: 1em;
  top: auto;
  bottom: 1em;
  gap: 0.4em;

  button {
    background: rgba(45, 55, 72, 0.7) !important;
    border: 1px solid rgba(212, 200, 184, 0.5) !important;
    box-shadow: 0 0.1em 0.4em rgba(0, 0, 0, 0.3) !important;
    filter: none !important;
    transition: all 0.15s ease !important;

    &:not(:disabled):hover {
      background: rgba(45, 55, 72, 0.9) !important;
      border-color: #d4c8b8 !important;
      box-shadow: 0 0.15em 0.6em rgba(0, 0, 0, 0.4) !important;
    }

    &:disabled {
      opacity: 0.3 !important;
      border-color: rgba(255, 255, 255, 0.15) !important;
    }
  }
`

const tableBorder = css`
  border: 1px solid white;
`
