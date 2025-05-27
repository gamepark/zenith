/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Credit } from '@gamepark/zenith/material/Credit'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { createPortal } from 'react-dom'
import { creditTokenDescription } from '../material/CreditTokendescription'

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
          player={player}
          css={panelPosition(index)}
          mainCounter={{ image: creditTokenDescription.images[Credit.Credit1], value: new PlayerHelper(rules.game, player.id).credits }}
        />
      ))}
    </>,
    root
  )
}

const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
`
