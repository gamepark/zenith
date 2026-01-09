/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialContext, StyledPlayerPanel, useMaterialContext, usePlayers, useRules } from '@gamepark/react-game'
import { Credit } from '@gamepark/zenith/material/Credit'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { createPortal } from 'react-dom'
import { getMyTeamColor } from '../locators/position.utils'
import { creditTokenDescription } from '../material/CreditTokendescription'
import { zenithiumTokenDescription } from '../material/ZenithiumTokenDescription'

export const PlayerPanels = () => {
  const players = usePlayers<PlayerId>({ sortFromMe: true })
  const root = document.getElementById('root')
  const rules = useRules<ZenithRules>()!
  const context = useMaterialContext()
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player) => {
        return (
          <StyledPlayerPanel
            key={player.id}
            activeRing
            countersPerLine={2}
            player={player}
            css={[panelPosition, getPanelPosition(player.id, context)]}
            counters={[
              { image: creditTokenDescription.images[Credit.Credit1], value: new PlayerHelper(rules.game, player.id).credits },
              { image: zenithiumTokenDescription.image, value: new PlayerHelper(rules.game, player.id).zenithium }
            ]}
            //mainCounter={{ image: creditTokenDescription.images[Credit.Credit1], value: new PlayerHelper(rules.game, player.id).credits }}
          />
        )
      })}
    </>,
    root
  )
}

const panelPosition = css`
  position: absolute;
  width: 35em;

  > div:last-of-type {
    flex-direction: row;

    > div {git 
      width: 50%;
    }
  }
`

const getPanelPosition = (player: PlayerId, context: MaterialContext) => {
  const itsMyTeam = isMyTeam(player, context)
  let index: number | undefined
  if (itsMyTeam) {
    const itsMe = (context.player ?? context.rules.players[0]) === player
    index = itsMe ? 0 : 3
  } else {
    const opponents = context.rules.players.filter((p) => !isMyTeam(p, context))
    const left = opponents[0] === player
    index = left ? 2 : 1
  }

  if (context.rules.players.length === 2) return [bottomRightPanelCss, topLeftPanelCss][index]
  return [bottomLeftPanelCss, topLeftPanelCss, topRightPanelCss, bottomRightPanelCss][index]
}

const isMyTeam = (player: PlayerId, context: MaterialContext) => {
  return getMyTeamColor(context) === getTeamColor(player)
}

const topLeftPanelCss = css`
  left: 21.5em;
  top: 8.5em;
`

const topRightPanelCss = css`
  right: 21.5em;
  top: 8.5em;
`

const bottomRightPanelCss = css`
  right: 21.5em;
  bottom: 1em;
`

const bottomLeftPanelCss = css`
  left: 21.5em;
  bottom: 1em;
`
