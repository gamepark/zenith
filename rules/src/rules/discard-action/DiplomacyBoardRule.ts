import { CustomMove, isCustomMoveType, isStartPlayerTurn, isStartRule, PlayerTurnRule } from '@gamepark/rules-api'
import { Faction } from '../../material/Faction'
import { CustomMoveType } from '../CustomMoveType'
import { EffectHelper } from '../helper/EffectHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'
import { getDiplomacyActions } from './DiplomacyActions'

export class DiplomacyBoardRule extends PlayerTurnRule {
  getPlayerMoves() {
    return [this.customMove(CustomMoveType.Diplomacy)]
  }

  get faction() {
    return this.remind<Faction>(Memory.DiscardFaction)
  }

  applyDiplomacy() {
    this.memorize(Memory.Effects, JSON.parse(JSON.stringify(getDiplomacyActions(this.game.players.length)[this.faction])))
    return new EffectHelper(this.game, this.player).applyFirstEffect()
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(CustomMoveType.Diplomacy)(move)) return []
    const effectMoves = this.applyDiplomacy()
    if (effectMoves.some((move) => isStartRule(move) || isStartPlayerTurn(move))) {
      return effectMoves
    }

    return [this.startRule(RuleId.Refill)]
  }
}
