/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getPlanetForLog } from '../../i18n/trans.components'

export const WinPlanetLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const move: MoveItem = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const item = rules.material(MaterialType.InfluenceDisc).getItem<Influence>(move.itemIndex)
  const count = Math.abs(move.location.x! - item.location.x!)
  const activePlayer = rules.getActivePlayer()!
  const playerName = usePlayerName(activePlayer)
  // The disc is captured by the team it is moved to, which is NOT always the active
  // player: a "give influence" effect can push a disc into the opponent's control zone.
  const winningTeam = move.location.player ?? new PlayerHelper(context.game as MaterialGame, activePlayer).team

  return (
    <>
      <Trans
        i18nKey="log.win.planet"
        values={{
          player: playerName,
          count: count,
          team: t(`team.${winningTeam}`)
        }}
        components={{
          influenceIcon: getPlanetForLog(item.id)
        }}
      />
    </>
  )
}
