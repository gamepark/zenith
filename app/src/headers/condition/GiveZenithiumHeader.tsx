import { PlayMoveButton, useLegalMove, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ConditionType, ExpandedEffect, GiveZenithiumEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { headerPictureCss } from '../header.css'
import { useDoConditionHeaderContext } from './condition.utils'

export const GiveZenithiumHeader = () => {
  const { itsMe, name, conditionEffect } = useDoConditionHeaderContext<GiveZenithiumEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const quantity = conditionEffect.quantity ?? 1

  // Legal Moves
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))

  const give = useLegalMove<CustomMove>(
    (move: MaterialMove) =>
      effect.condition.type === ConditionType.DoEffect &&
      effect.condition.effect.type === EffectType.GiveZenithium &&
      isCustomMoveType(CustomMoveType.DoCondition)(move)
  )!

  const source = <EffectSource effectSource={effect.effectSource} />
  return (
    <Trans
      defaults={itsMe ? 'header.condition.give-zenithium' : 'header.condition.give-zenithium.player'}
      values={{
        player: name,
        count: quantity
      }}
      components={{
        ...HeaderTransComponents,
        pass: <PlayMoveButton move={pass} />,
        source: source,
        giveZenithium: <GiveZenithiumButton move={give} quantity={quantity} />
      }}
    />
  )
}

const GiveZenithiumButton: FC<{ move: MaterialMove; quantity: number }> = ({ move, quantity }) => {
  return (
    <PlayMoveButton move={move} css={headerPictureCss}>
      {quantity}
      {HeaderTransComponents.zenithium}
    </PlayMoveButton>
  )
}
