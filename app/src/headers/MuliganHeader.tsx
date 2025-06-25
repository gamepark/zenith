/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { Trans } from 'react-i18next'
import { TransComponents } from '../i18n/trans.components'

export const MuliganHeader = () => {
  const endTurn = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const rules = useRules<ZenithRules>()!
  const me = usePlayerId<PlayerId>()
  const players = rules.game.rule?.players ?? []
  const imActive = me && players.includes(me)
  const name = usePlayerName(players[0])
  if (me && imActive) {
    return <Trans defaults="header.mulligan" components={{ ...TransComponents, pass: <PlayMoveButton move={endTurn} /> }} />
  }

  if (players.length > 1) {
    return <Trans defaults="header.mulligan.others" components={TransComponents} />
  }

  return <Trans defaults="header.mulligan.other" values={{ player: name }} components={TransComponents} />
}
