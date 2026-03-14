import { PlayMoveButton, useLegalMove, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, DiscardEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { useDoConditionHeaderContext } from './condition.utils'

export const DiscardConditionHeader = () => {
  const { itsMe, name } = useDoConditionHeaderContext<DiscardEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>

  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    return (
      <Trans
        i18nKey="header.condition.discard"
        values={{ count: 1 }}
        components={{
          ...HeaderTransComponents,
          pass: <PlayMoveButton move={pass} />,
          source
        }}
      />
    )
  }

  return (
    <Trans
      i18nKey="header.condition.discard.player"
      values={{ count: 1, player: name }}
      components={{
        ...HeaderTransComponents,
        source
      }}
    />
  )
}
