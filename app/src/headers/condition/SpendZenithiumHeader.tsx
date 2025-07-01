import { PlayMoveButton, useLegalMove, useLegalMoves, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ConditionType, ExpandedEffect, SpendZenithiumEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { headerPictureCss } from '../header.css'
import { useDoConditionHeaderContext } from './condition.utils'

export const SpendZenithiumHeader = () => {
  const { itsMe, name, conditionEffect } = useDoConditionHeaderContext<SpendZenithiumEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const quantities = conditionEffect.quantities

  // Legal Moves
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))

  const spendZenithium = useLegalMoves<CustomMove>(
    (move: MaterialMove) =>
      effect.condition.type === ConditionType.DoEffect &&
      effect.condition.effect.type === EffectType.SpendZenithium &&
      isCustomMoveType(CustomMoveType.DoCondition)(move)
  )

  const source = <EffectSource effectSource={effect.effectSource} />
  return (
    <Trans
      defaults={itsMe ? 'header.condition.spend-zenithium' : 'header.condition.spend-zenithium.player'}
      values={{
        player: name
      }}
      components={{
        ...HeaderTransComponents,
        pass: <PlayMoveButton move={pass} />,
        source: source,
        spendZenithium: (
          <>
            {quantities.map((quantity) => {
              const move = spendZenithium.find((move) => move.data === quantity)
              return (
                <>
                  <PlayMoveButton move={move} css={headerPictureCss}>
                    {quantity}
                    {HeaderTransComponents.zenithium}
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
