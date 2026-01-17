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
  left: 50%;
  transform: translateX(-50%);
`

const tableBorder = css`
  border: 1px solid white;
`
