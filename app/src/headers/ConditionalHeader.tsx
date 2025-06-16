/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove, useLegalMoves, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, isMoveItemType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ConditionType, Effect, isDoEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'

export const ConditionalHeader = () => {
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<Effect[]>(Memory.Effects)[0] as ConditionalEffect
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const doIt = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.DoCondition)(move))
  const spendCredits = useLegalMoves<CustomMove>(
    (move: MaterialMove) =>
      effect.condition.type === ConditionType.DoEffect &&
      effect.condition.effect.type === EffectType.SpendCredit &&
      isCustomMoveType(CustomMoveType.DoCondition)(move)
  )
  const spendZenithium = useLegalMoves<CustomMove>(
    (move: MaterialMove) =>
      effect.condition.type === ConditionType.DoEffect &&
      effect.condition.effect.type === EffectType.SpendZenithium &&
      isCustomMoveType(CustomMoveType.DoCondition)(move)
  )

  const condition = effect.condition
  if (isDoEffect(condition)) {
    if (condition.effect.type === EffectType.SpendZenithium) {
      const quantities = condition.effect.quantities
      return (
        <>
          {quantities.map((quantity) => {
            const move = spendZenithium.find((move) => move.data === quantity)
            return <PlayMoveButton move={move}>Spend {quantity}</PlayMoveButton>
          })}
        </>
      )
    }

    if (condition.effect.type === EffectType.SpendCredit) {
      const quantities = condition.effect.quantities
      return (
        <>
          {quantities.map((quantity) => {
            const move = spendCredits.find((move) => move.data === quantity)
            return <PlayMoveButton move={move}>Spend {quantity}</PlayMoveButton>
          })}
        </>
      )
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
