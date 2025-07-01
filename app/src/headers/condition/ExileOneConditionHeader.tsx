import { PlayMoveButton, useLegalMove, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ExileEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { useDoConditionHeaderContext } from './condition.utils'

export const ExileOneConditionHeader = () => {
  const { itsMe, name, conditionEffect } = useDoConditionHeaderContext<ExileEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const quantity = conditionEffect.quantity

  // Legal Moves
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    if (conditionEffect.opponent) {
      return (
        <Trans
          defaults="header.condition.exile.opponent"
          values={{ count: quantity }}
          components={{
            ...HeaderTransComponents,
            pass: <PlayMoveButton move={pass} />,
            source: source
          }}
        />
      )
    }

    return (
      <Trans
        defaults="header.condition.exile"
        values={{ count: quantity }}
        components={{
          ...HeaderTransComponents,
          pass: <PlayMoveButton move={pass} />,
          source: source
        }}
      />
    )
  }

  if (conditionEffect.opponent) {
    return (
      <Trans
        defaults="header.condition.exile.opponent.player"
        values={{ count: quantity, player: name }}
        components={{
          ...HeaderTransComponents,
          source: source
        }}
      />
    )
  }

  return (
    <Trans
      defaults="header.condition.exile.player"
      values={{ count: quantity, player: name }}
      components={{
        ...HeaderTransComponents,
        source: source
      }}
    />
  )
}
