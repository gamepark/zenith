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

export const ResetInfluenceLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const move = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const item = rules.material(MaterialType.InfluenceDisc).getItem<Influence>(move.itemIndex)
  const activePlayer = rules.getActivePlayer()!
  const playerName = usePlayerName(activePlayer)

  return (
    <Trans
      i18nKey="log.reset.influence"
      values={{
        player: playerName,
        team: t(`team.${new PlayerHelper(context.game as MaterialGame, activePlayer).team}`)
      }}
      components={{
        influenceIcon: getPlanetForLog(item.id)
      }}
    />
  )
}
