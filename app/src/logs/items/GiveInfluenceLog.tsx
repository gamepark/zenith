/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TransComponents } from '../../i18n/trans.components'

export const GiveInfluenceLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const move: MoveItem = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const item = rules.material(MaterialType.InfluenceDisc).getItem<Influence>(move.itemIndex)
  const count = Math.abs(item.location.x! - move.location.x!)
  const activePlayer = rules.getActivePlayer()!
  const playerName = usePlayerName(activePlayer)

  return (
    <>
      <Trans
        defaults="log.give.influence"
        values={{
          player: playerName,
          count: count,
          team: t(`team.${getTeamColor(activePlayer)}`)
        }}
        components={{
          influenceIcon: getPlanet(item.id)
        }}
      />
    </>
  )
}

const getPlanet = (influence: Influence) => {
  switch (influence) {
    case Influence.Mercury:
      return TransComponents.mercury
    case Influence.Venus:
      return TransComponents.venus
    case Influence.Terra:
      return TransComponents.terra
    case Influence.Jupiter:
      return TransComponents.jupiter
    case Influence.Mars:
      return TransComponents.mars
  }
}
