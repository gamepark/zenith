import { CustomMove, isStartPlayerTurn, isStartRule, ItemMove, MaterialGame, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { credits } from '../../material/Credit'
import { Effect } from '../../material/effect/Effect'
import { MaterialType } from '../../material/MaterialType'
import { TeamColor } from '../../TeamColor'
import { EffectRuleIds } from '../helper/EffectRuleIds'
import { PlayerHelper } from '../helper/PlayerHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export abstract class EffectRule<E extends Effect = Effect> extends PlayerTurnRule {
  effect: E

  constructor(game: MaterialGame, effect?: E) {
    super(game)
    this.effect = effect ?? (this.firstEffect as E)
  }

  onRuleStart() {
    if (!this.isPossible()) {
      this.removeFirstEffect()
      return this.afterEffectPlayed()
    }

    return []
  }

  getAutomaticEffectMoves(): MaterialMove[] {
    return []
  }

  isPossible() {
    return true
  }

  get creditMoney() {
    return this.material(MaterialType.CreditToken).money(credits)
  }

  setExtraData(_extraData: Record<string, unknown>) {}

  decrement(_move: ItemMove | CustomMove) {
    return true
  }

  getExtraDataFromMove(_move: ItemMove | CustomMove): Record<string, unknown> {
    return {
      quantity: 1
    }
  }

  get effects(): Effect[] {
    return this.remind<Effect[]>(Memory.Effects)
  }

  get firstEffect(): Effect | undefined {
    return this.effects[0]
  }

  get playerHelper() {
    return new PlayerHelper(this.game, this.player)
  }

  removeFirstEffect() {
    this.memorize(Memory.Effects, (effects: Effect[]) => {
      effects.shift()
      return effects
    })
  }

  applyFirstEffect() {
    const effect = this.firstEffect
    if (!effect) {
      return []
    }

    return [this.startRule(EffectRuleIds[effect.type])]
  }

  afterEffectPlayed() {
    const moves: MaterialMove[] = this.applyFirstEffect()
    if (!moves.some((move) => isStartRule(move) || isStartPlayerTurn(move)) && !this.effects.length) {
      moves.push(this.startRule(RuleId.Refill))
    }
    return moves
  }

  get opponentTeam() {
    return this.playerHelper.team === TeamColor.White ? TeamColor.Black : TeamColor.White
  }
}
