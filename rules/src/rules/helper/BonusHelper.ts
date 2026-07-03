import { Material, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { Bonus } from '../../material/Bonus'
import { Bonuses } from '../../material/Bonuses'
import { Effect, ExpandedEffect } from '../../material/effect/Effect'
import { EffectType } from '../../material/effect/EffectType'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { Memory } from '../Memory'

export type TechnologyBonusResult = {
  effect: Effect
  moves: MaterialMove[]
  bonusId: Bonus
}

export class BonusHelper extends MaterialRulesPart {
  applyInfluenceBonus(influence: Influence, toOpponent = false): MaterialMove[] {
    const bonusToken = this.material(MaterialType.BonusToken).location(LocationType.PlanetBoardBonusSpace).locationId(influence)
    return this.applyBonusEffect(bonusToken, toOpponent)
  }

  getTechnologyBonus(token: Material): TechnologyBonusResult | undefined {
    const tokenItem = token.getItem()!
    if (tokenItem.location.x !== 2) return
    const bonusToken = this.material(MaterialType.BonusToken).location(LocationType.TechnologyBoardBonusSpace).parent(tokenItem.location.parent)
    if (!bonusToken.length) return
    return {
      effect: this.getBonusEffect(bonusToken)!,
      moves: [
        bonusToken.moveItem({
          type: LocationType.BonusDiscard
        })
      ],
      bonusId: bonusToken.getItem()!.id
    }
  }

  applyBonusEffect(bonusToken: Material, toOpponent = false): MaterialMove[] {
    const moves: MaterialMove[] = []
    const bonusEffect = this.getBonusEffect(bonusToken)
    if (bonusEffect) {
      moves.push(
        bonusToken.moveItem({
          type: LocationType.BonusDiscard
        })
      )

      const effectSource = { type: MaterialType.BonusToken, value: bonusToken.getItem()!.id }
      let effect: Effect = bonusEffect
      let resolvedByOpponent = false
      if (toOpponent) {
        const redirected = this.forOpponent(bonusEffect)
        effect = redirected.effect
        resolvedByOpponent = redirected.resolvedByOpponent ?? false
      } else if (this.resolvingForNonActivePlayer()) {
        // The bonus was won while an opponent is resolving on someone else's turn (e.g. a
        // "win influence" bonus that captured another planet). It belongs to that opponent,
        // so it must stay with them — flag it, but do NOT redirect it with forOpponent.
        resolvedByOpponent = true
      }

      const effects = this.remind<ExpandedEffect[]>(Memory.Effects)
      effects.splice(1, 0, { ...effect, effectSource, ...(resolvedByOpponent ? { resolvedByOpponent: true } : {}) } as ExpandedEffect)
    }

    return moves
  }

  /** True when an opponent is currently resolving effects on another player's turn. */
  private resolvingForNonActivePlayer(): boolean {
    const turnOwner = this.remind<PlayerId | undefined>(Memory.ActivePlayer)
    return turnOwner !== undefined && this.game.rule?.player !== turnOwner
  }

  /**
   * A planet bonus won by the opponent (they captured a "given" planet) must reward THEM.
   * Resolve each bonus as simply as possible:
   *  - credits / zenithium / mobilize: reward the opponent team via the `opponent` flag,
   *  - take-leader-badge: hand the badge over by turning it into a give-leader-badge,
   *  - exile / transfer / win-influence: interactive, so the opponent must play them —
   *    tag `resolvedByOpponent` so the effect resolution hands control to them.
   */
  private forOpponent(effect: Effect): { effect: Effect; resolvedByOpponent?: boolean } {
    switch (effect.type) {
      case EffectType.WinCredit:
      case EffectType.WinZenithium:
      case EffectType.Mobilize:
        return { effect: { ...effect, opponent: true } }
      case EffectType.TakeLeaderBadge:
        return { effect: { type: EffectType.GiveLeaderBadge } }
      case EffectType.Exile:
      case EffectType.Transfer:
      case EffectType.WinInfluence:
        return { effect, resolvedByOpponent: true }
      default:
        return { effect }
    }
  }

  getBonusEffect(bonusToken: Material) {
    if (bonusToken.length) {
      const bonusItem = bonusToken.getItem<Bonus>()!
      const bonusId = bonusItem.id
      return JSON.parse(JSON.stringify(Bonuses[bonusId].effect)) as Effect
    }
    return
  }
}
