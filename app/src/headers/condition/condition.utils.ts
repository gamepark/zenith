import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { ConditionalEffect, DoEffectCondition, Effect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { MaterialRules } from '@gamepark/rules-api'

export const useDoConditionHeaderContext = <T extends Effect = Effect>() => {
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const condition = effect.condition as DoEffectCondition
  const conditionEffect = condition.effect as ExpandedEffect<T>
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me && me === activePlayer
  const name = usePlayerName(activePlayer)
  return {
    itsMe,
    name,
    activePlayer,
    conditionEffect,
    resultingEffect: effect.effect
  }
}
