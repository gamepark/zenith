import { MoveComponentProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MaterialMoveBuilder, MoveItem, Location } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TransComponents } from './trans.components'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const TakeLeaderBadgeLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const move: MoveItem = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const activePlayer = rules.getActivePlayer()!
  const playerName = usePlayerName(activePlayer)

  return (
    <>
      <Trans
        defaults="log.take.leaderBadge"
        values={{
          player: playerName,
          team: t(`team.${move.location.player}`)
        }}
        components={{
          linkBadge: (
            <PlayMoveButton
              move={displayMaterialHelp(MaterialType.LeaderBadgeToken, {
                location: move.location as Location
              })}
              transient
            />
          ),
          leaderBadge: move.location.rotation ? TransComponents.leaderGold : TransComponents.leaderSilver
        }}
      />
    </>
  )
}
