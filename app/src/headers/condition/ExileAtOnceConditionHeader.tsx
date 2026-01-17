import { PlayMoveButton, useLegalMove, useLegalMoves, useRules } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemTypeAtOnce, MaterialMove, MaterialRules, MoveItemsAtOnce } from '@gamepark/rules-api'
import { ConditionalEffect, ExileEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { headerPictureCss } from '../header.css'
import { useDoConditionHeaderContext } from './condition.utils'

export const ExileAtOnceConditionHeader = () => {
  const { itsMe, name, conditionEffect } = useDoConditionHeaderContext<ExileEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const quantities = conditionEffect.quantities!

  // Legal Moves
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))

  const exile = useLegalMoves<MoveItemsAtOnce>(
    (move: MaterialMove) => isMoveItemTypeAtOnce(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard
  )

  const source = <EffectSource effectSource={effect.effectSource} />
  return (
    <Trans
      i18nKey={itsMe ? 'header.condition.exile-at-once' : 'header.condition.exile-at-once.player'}
      values={{
        player: name
      }}
      components={{
        ...HeaderTransComponents,
        pass: <PlayMoveButton move={pass} />,
        source: source,
        discardCards: (
          <>
            {quantities.map((quantity) => {
              const move = exile.find((move) => move.indexes.length === quantity)
              return (
                <>
                  <PlayMoveButton move={move} css={headerPictureCss}>
                    {quantity}
                  </PlayMoveButton>
                  &nbsp;
                </>
              )
            })}
          </>
        )
      }}
    />
  )
}
