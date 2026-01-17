import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { MaterialType } from '../material/MaterialType'
import { CustomMoveType } from './CustomMoveType'
import { DiplomacyBoardRule } from './discard-action/DiplomacyBoardRule'
import { TechnologyBoardRule } from './discard-action/TechnologyBoardRule'
import { RuleId } from './RuleId'

export class DiscardActionRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    moves.push(...new TechnologyBoardRule(this.game).getPlayerMoves())
    moves.push(...new DiplomacyBoardRule(this.game).getPlayerMoves())

    if (!moves.length) {
      moves.push(this.startRule(RuleId.Refill))
    }

    return moves
  }

  beforeItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.TechMarker)(move)) {
      return new TechnologyBoardRule(this.game).beforeItemMove(move)
    }

    return []
  }

  afterItemMove(move: ItemMove) {
    if (isMoveItemType(MaterialType.TechMarker)(move)) {
      return new TechnologyBoardRule(this.game).afterItemMove(move)
    }

    return []
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.Diplomacy)(move)) {
      return new DiplomacyBoardRule(this.game).onCustomMove(move)
    }

    return []
  }
}
