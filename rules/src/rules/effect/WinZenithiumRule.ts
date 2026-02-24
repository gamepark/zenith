import { MaterialMove } from '@gamepark/rules-api'
import { WinZenithiumEffect } from '../../material/effect/Effect'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../Memory'
import { EffectRule } from './index'

export class WinZenithiumRule extends EffectRule<WinZenithiumEffect> {
  onRuleStart() {
    const moves: MaterialMove[] = super.onRuleStart()
    if (moves.length > 0) return moves
    const zenithium = this.wonZenithium
    this.memorize(Memory.Zenithium, this.effect.quantity ?? 1)
    this.memorize(Memory.CurrentEffect, JSON.parse(JSON.stringify(this.effect)))

    moves.push(
      this.zenithium.createItem({
        location: {
          type: LocationType.TeamZenithium,
          player: this.effect.opponent ? this.opponentTeam : this.playerHelper.team
        },
        quantity: zenithium
      })
    )

    this.removeFirstEffect()
    moves.push(...this.afterEffectPlayed())

    return moves
  }

  setExtraData(_extraData: Record<string, unknown>) {
    if (_extraData.quantity) {
      this.effect.quantity ??= _extraData.quantity as number
    }
  }

  get zenithium() {
    return this.material(MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(this.playerHelper.team)
  }

  get wonZenithium() {
    if (this.effect.quantity) return this.effect.quantity
    if (this.effect.perLevel1Technology) return this.effect.perLevel1Technology[this.level1Technology - 1] ?? 0
    return 1
  }

  isPossible(): boolean {
    if (this.effect.perLevel1Technology) return this.level1Technology > 0
    return true
  }

  get level1Technology() {
    return this.material(MaterialType.TechMarker)
      .player(this.playerHelper.team)
      .location((l) => l.type === LocationType.TechnologyBoardTokenSpace && l.x! >= 1).length
  }

  onRuleEnd() {
    this.forget(Memory.Zenithium)
    this.forget(Memory.CurrentEffect)
    return []
  }
}
