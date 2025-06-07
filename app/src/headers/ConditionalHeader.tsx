/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useLegalMove, useLegalMoves, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, isMoveItemType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ConditionType, Effect } from '@gamepark/zenith/material/effect/Effect'
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

  const giveLeaderBadge = useLegalMove((move: MaterialMove) => isMoveItemType(MaterialType.LeaderBadgeToken)(move))
  if (giveLeaderBadge) {
    return (
      <>
        <PlayMoveButton move={pass}>Passez</PlayMoveButton>
        <PlayMoveButton move={giveLeaderBadge}>Donner le badge</PlayMoveButton>
      </>
    )
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
