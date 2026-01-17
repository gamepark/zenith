import { MaterialMove } from '@gamepark/rules-api'
import { uniq } from 'es-toolkit/compat'
import { Agent } from '../../material/Agent'
import { Agents } from '../../material/Agents'
import { WinCreditEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { CustomMoveType } from '../CustomMoveType'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class WinCreditRule extends EffectRule<WinCreditEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const money = this.creditMoney
    const credits = this.wonCredit
    this.memorize(Memory.Credit, credits)
    this.memorize(Memory.CurrentEffect, JSON.parse(JSON.stringify(this.effect)))
    moves.push(this.customMove(CustomMoveType.WinCreditLog, credits))
    moves.push(...money.addMoney(credits, { type: LocationType.TeamCredit, player: this.effect.opponent ? this.opponentTeam : this.playerHelper.team }))

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())
    return moves
  }

  get wonCredit() {
    if (this.effect.quantity) return this.effect.quantity
    if (this.effect.perLevel1Technology) return this.effect.perLevel1Technology[this.level1Technology - 1]
    if (this.effect.factorPerDifferentInfluence) return this.distinctInfluence * this.effect.factorPerDifferentInfluence
    if (this.effect.factorPerDifferentOpponentInfluence) return this.opponentDistinctInfluence * this.effect.factorPerDifferentOpponentInfluence
    return 0
  }

  isPossible(): boolean {
    if (this.effect.perLevel1Technology) return this.level1Technology > 0
    if (this.effect.factorPerDifferentInfluence) return this.distinctInfluence > 0
    if (this.effect.factorPerDifferentOpponentInfluence) return this.opponentDistinctInfluence > 0
    return true
  }

  get distinctInfluence() {
    const items = this.material(MaterialType.AgentCard)
      .location(LocationType.Influence)
      .player(this.playerHelper.team)
      .getItems<Agent>()
      .map((a) => Agents[a.id].influence)
    return uniq(items).length
  }

  get opponentDistinctInfluence() {
    const items = this.material(MaterialType.AgentCard)
      .location(LocationType.Influence)
      .player(this.opponentTeam)
      .getItems<Agent>()
      .map((a) => Agents[a.id].influence)
    return uniq(items).length
  }

  get level1Technology() {
    return this.material(MaterialType.TechMarker)
      .player(this.playerHelper.team)
      .location((l) => l.type === LocationType.TechnologyBoardTokenSpace && l.x === 1).length
  }

  setExtraData(_extraData: Record<string, unknown>) {
    if (_extraData.quantity) {
      this.effect.quantity ??= _extraData.quantity as number
    }
  }

  onRuleEnd() {
    this.forget(Memory.Credit)
    this.forget(Memory.CurrentEffect)
    return []
  }
}
