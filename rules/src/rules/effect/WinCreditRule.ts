import { MaterialMove } from '@gamepark/rules-api'
import { Agent } from '../../material/Agent'
import { WinCreditEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectRule } from './index'
import uniq from 'lodash/uniq'

export class WinCreditRule extends EffectRule<WinCreditEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const money = this.creditMoney
    moves.push(...money.addMoney(this.wonCredit, { type: LocationType.TeamCredit, player: this.effect.opponent ? this.opponentTeam : this.playerHelper.team }))

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
      .map((a) => a.id)
    return uniq(items).length
  }

  get opponentDistinctInfluence() {
    const items = this.material(MaterialType.AgentCard)
      .location(LocationType.Influence)
      .player(this.opponentTeam)
      .getItems<Agent>()
      .map((a) => a.id)
    return uniq(items).length
  }

  get level1Technology() {
    return this.material(MaterialType.TechnologyBoard)
      .player(this.playerHelper.team)
      .location((l) => l.type === LocationType.TechnologyBoardTokenSpace && l.x === 1).length
  }

  setExtraData(_extraData: Record<string, unknown>) {
    if (_extraData.quantity) {
      this.effect.quantity ??= _extraData.quantity as number
    }
  }
}
