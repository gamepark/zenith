import { PlayMoveButton, useLegalMove, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ExpandedEffect, TransferEffect } from '@gamepark/zenith/material/effect/Effect'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { useDoConditionHeaderContext } from './condition.utils'

export const TransferConditionHeader = () => {
  const { itsMe, name } = useDoConditionHeaderContext<TransferEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const mandatory = effect.mandatory

  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))

  const source = <EffectSource effectSource={effect.effectSource} />

  if (itsMe) {
    if (mandatory) {
      return (
        <Trans
          i18nKey="header.condition.transfer.mandatory"
          components={{ ...HeaderTransComponents, source }}
        />
      )
    }
    return (
      <Trans
        i18nKey="header.condition.transfer"
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
      i18nKey={mandatory ? 'header.condition.transfer.mandatory.player' : 'header.condition.transfer.player'}
      values={{ player: name }}
      components={{ ...HeaderTransComponents, source }}
    />
  )
}
