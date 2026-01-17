import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { DiscardRule } from '@gamepark/zenith/rules/effect'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { AgentCardLog } from './components/AgentCardLog'

export const DiscardEffectLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move: MoveItem = props.move as MoveItem
  const rules = new DiscardRule(context.game as MaterialGame)
  const item = rules.material(MaterialType.AgentCard).getItem(move.itemIndex)
  const itemId = item.id ?? move.reveal?.id
  const playerName = usePlayerName(rules.getActivePlayer())
  const effect = rules.effect

  return (
    <>
      <Trans
        i18nKey={effect.full ? 'log.discard.effect.full' : 'log.discard'}
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
