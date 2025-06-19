import { MoveComponentProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MaterialMoveBuilder, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const DiscardLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const move: MoveItem = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const item = rules.material(MaterialType.AgentCard).getItem(move.itemIndex)
  const itemId = item.id ?? move.reveal?.id
  const playerName = usePlayerName(rules.getActivePlayer())

  return (
    <>
      <Trans
        defaults="log.discard"
        values={{
          player: playerName,
          agent: t(`agent.${itemId}`)
        }}
        components={{
          card: <PlayMoveButton move={displayMaterialHelp(MaterialType.AgentCard, { id: itemId })} transient />
        }}
      />
    </>
  )
}
