import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { AgentCardLog } from './components/AgentCardLog'

export const DiscardActionLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
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
          player: playerName
        }}
        components={{
          agent: <AgentCardLog agent={itemId} />
        }}
      />
    </>
  )
}
