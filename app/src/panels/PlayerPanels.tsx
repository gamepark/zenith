/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Credit } from '@gamepark/zenith/material/Credit'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { createPortal } from 'react-dom'
import { creditTokenDescription } from '../material/CreditTokendescription'
import { zenithiumTokenDescription } from '../material/ZenithiumTokenDescription'

export const PlayerPanels = () => {
  const players = usePlayers<PlayerId>({ sortFromMe: true })
  const root = document.getElementById('root')
  const rules = useRules<ZenithRules>()!
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => (
        <StyledPlayerPanel
          key={player.id}
          activeRing
          player={player}
          css={panelPosition(index)}
          counters={[
            { image: creditTokenDescription.images[Credit.Credit1], value: new PlayerHelper(rules.game, player.id).credits, imageCss: counterImageStyle },
            { image: zenithiumTokenDescription.image, value: new PlayerHelper(rules.game, player.id).zenithium, imageCss: counterImageStyle }
          ]}
        />
      ))}
    </>,
    root
  )
}

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`

const counterImageStyle = css`
  transition: transform 0.2s ease-in-out;
  &:hover {
    animation: ${pulse} 0.4s ease-in-out;
  }
`

const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;

  /* Smooth transitions for counter value changes */
  & [class*="counter"], & [class*="Counter"] {
    transition: all 0.3s ease-out;
  }
`
