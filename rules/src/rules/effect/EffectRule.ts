import { CustomMove, isStartPlayerTurn, isStartRule, ItemMove, MaterialGame, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { RuleMove } from '@gamepark/rules-api/dist/material/moves'
import { RuleStep } from '@gamepark/rules-api/dist/material/rules/RuleStep'
import { PlayMoveContext } from '@gamepark/rules-api/dist/Rules'
import { credits } from '../../material/Credit'
import { ConditionalEffect, Effect, ExpandedEffect } from '../../material/effect/Effect'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { TeamColor } from '../../TeamColor'
import { CustomMoveType } from '../CustomMoveType'
import { getEffectRule } from '../helper/EffectHelper'
import { EffectRuleIds } from '../helper/EffectRuleIds'
import { PlayerHelper } from '../helper/PlayerHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export abstract class EffectRule<E extends Effect = Effect> extends PlayerTurnRule {
  effect: ExpandedEffect<E>

  constructor(game: MaterialGame, effect?: E) {
    super(game)
    this.effect = (effect ?? this.firstEffect) as ExpandedEffect<E>
  }

  onRuleStart(_move?: RuleMove, _previousRule?: RuleStep, _context?: PlayMoveContext) {
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

  get effects(): ExpandedEffect[] {
    return this.remind<ExpandedEffect[]>(Memory.Effects)
  }

  get firstEffect(): ExpandedEffect | undefined {
    return this.effects[0]
  }

  get playerHelper() {
    return new PlayerHelper(this.game, this.player)
  }

  removeFirstEffect() {
    this.memorize(Memory.Effects, (effects: ExpandedEffect[]) => {
      effects.shift()
      return effects
    })
  }

  applyFirstEffect() {
    const effect = this.firstEffect
    if (!effect) {
      return []
    }

    const ruleId = EffectRuleIds[effect.type]
    const activePlayer = this.remind<PlayerId | undefined>(Memory.ActivePlayer)

    if (effect.resolvedByOpponent) {
      // This effect belongs to an opponent (a bonus from a "given" planet they captured, or
      // one won while already resolving for them). Remember whose turn it actually is, then
      // hand control over to an opponent of that player.
      const turnOwner = activePlayer ?? this.player
      if (activePlayer === undefined) this.memorize(Memory.ActivePlayer, turnOwner)
      return this.startEffectForOpponent(ruleId, turnOwner)
    }

    // A normal effect must be resolved by the player whose turn it is. If an opponent is
    // still active (they just resolved their bonus), hand the turn back first.
    if (activePlayer !== undefined && this.player !== activePlayer) {
      return [this.startPlayerTurn(ruleId, activePlayer)]
    }

    return [this.startRule(ruleId)]
  }

  private startEffectForOpponent(ruleId: RuleId, turnOwner: PlayerId): MaterialMove[] {
    const ownerTeam = new PlayerHelper(this.game, turnOwner).team
    // Already resolving as an opponent (e.g. consecutive opponent bonuses): keep going.
    if (this.playerHelper.team !== ownerTeam) {
      return [this.startRule(ruleId)]
    }

    const opponents = this.game.players.filter((player) => new PlayerHelper(this.game, player).team !== ownerTeam)
    if (opponents.length === 1) {
      return [this.startPlayerTurn(ruleId, opponents[0])]
    }

    // 4 players: one of the two opponents is drawn at random by the server. The move is
    // unpredictable, so the client waits for that draw (see ZenithRules).
    return [this.customMove(CustomMoveType.HandToOpponent)]
  }

  afterEffectPlayed() {
    const moves: MaterialMove[] = this.applyFirstEffect()
    if (!moves.some((move) => isStartRule(move) || isStartPlayerTurn(move)) && !this.effects.length) {
      // The whole chain is done: refill under the player whose turn it actually is.
      const activePlayer = this.remind<PlayerId | undefined>(Memory.ActivePlayer)
      if (activePlayer !== undefined && this.player !== activePlayer) {
        moves.push(this.startPlayerTurn(RuleId.Refill, activePlayer))
      } else {
        moves.push(this.startRule(RuleId.Refill))
      }
      this.forget(Memory.ActivePlayer)
    }
    return moves
  }

  get opponentTeam() {
    return this.playerHelper.team === TeamColor.White ? TeamColor.Black : TeamColor.White
  }

  removeCondition(extraData?: Record<string, unknown>) {
    this.memorize(Memory.Effects, (effects: ExpandedEffect[]) => {
      const firstEffect = effects[0] as ExpandedEffect<ConditionalEffect>
      const { effect } = firstEffect

      if (extraData) {
        getEffectRule(this.game, effect).setExtraData(extraData)
      }

      return [{ ...effect, effectSource: firstEffect.effectSource }, ...effects.slice(1)]
    })
  }
}
