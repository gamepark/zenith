import { CustomMove, isCustomMoveType, PlayerTurnRule } from '@gamepark/rules-api'
import { Faction } from '../../material/Faction'
import { CustomMoveType } from '../CustomMoveType'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class DiplomacyBoardRule extends PlayerTurnRule {
  getPlayerMoves() {
    return [this.customMove(CustomMoveType.Diplomacy, this.faction)]
  }

  get faction() {
    return this.remind<Faction>(Memory.DiscardFaction)
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(CustomMoveType.Diplomacy)(move)) return []
    return [this.startRule(RuleId.Refill)]
  }
}
