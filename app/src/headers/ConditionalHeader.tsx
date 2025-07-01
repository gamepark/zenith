/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove, useLegalMoves, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, isMoveItemType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ConditionType, ExpandedEffect, isDoEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { ExileAtOnceConditionHeader } from './condition/ExileAtOnceConditionHeader'
import { ExileOneConditionHeader } from './condition/ExileOneConditionHeader'
import { GiveZenithiumHeader } from './condition/GiveZenithiumHeader'
import { SpendCreditHeader } from './condition/SpendCreditHeader'
import { SpendZenithiumHeader } from './condition/SpendZenithiumHeader'
import { ExileHeader } from './ExileHeader'

export const ConditionalHeader = () => {
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const doIt = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.DoCondition)(move))
  const spendCredits = useLegalMoves<CustomMove>(
    (move: MaterialMove) =>
      effect.condition.type === ConditionType.DoEffect &&
      effect.condition.effect.type === EffectType.SpendCredit &&
      isCustomMoveType(CustomMoveType.DoCondition)(move)
  )

  const condition = effect.condition
  if (isDoEffect(condition)) {
    if (condition.effect.type === EffectType.SpendZenithium) {
      return <SpendZenithiumHeader />
    }

    if (condition.effect.type === EffectType.GiveZenithium) {
      return <GiveZenithiumHeader />
    }

    if (condition.effect.type === EffectType.SpendCredit) {
      return <SpendCreditHeader />
    }

    if (condition.effect.type === EffectType.Exile && !effect.mandatory) {
      return condition.effect.quantities !== undefined ? <ExileAtOnceConditionHeader /> : <ExileOneConditionHeader />
    }

    if (condition.effect.type === EffectType.Exile && effect.mandatory) {
      return <ExileHeader effect={{ ...condition.effect, effectSource: effect.effectSource }} />
    }

    const giveLeaderBadge = useLegalMove((move: MaterialMove) => isMoveItemType(MaterialType.LeaderBadgeToken)(move))
    if (condition.effect.type === EffectType.GiveLeaderBadge) {
      return (
        <>
          <PlayMoveButton move={pass}>Passez</PlayMoveButton>
          <PlayMoveButton move={giveLeaderBadge}>Donner le badge</PlayMoveButton>
        </>
      )
    }
  }
  if (spendCredits.length) {
    return (
      <>
        {spendCredits.map((move) => (
          <PlayMoveButton move={move}>Spend {move.data}</PlayMoveButton>
        ))}
      </>
    )
  }
  return (
    <>
      <PlayMoveButton move={pass}>Passez</PlayMoveButton>
      <PlayMoveButton move={doIt}>Activer l'effet</PlayMoveButton>
    </>
  )
}
