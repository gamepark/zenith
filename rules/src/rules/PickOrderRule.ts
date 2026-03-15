import { CustomMove, isCustomMoveType, MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { PlayerId } from '../PlayerId'
import { PlayerHelper } from './helper/PlayerHelper'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PickOrderRule extends SimultaneousRule {
  onRuleStart() {
    this.forget(Memory.TeamFirst)
    return []
  }

  getActivePlayerLegalMoves(player: PlayerId): MaterialMove[] {
    if (this.remind(Memory.TeamFirst) !== undefined) {
      return []
    }

    const teammate = this.getTeammate(player)
    return [this.customMove(CustomMoveType.PickFirst, player), this.customMove(CustomMoveType.PickFirst, teammate)]
  }

  getTeammate(player: PlayerId): PlayerId {
    return new PlayerHelper(this.game, player).teammate!
  }

  onCustomMove(move: CustomMove): MaterialMove[] {
    if (!isCustomMoveType(CustomMoveType.PickFirst)(move)) return []

    const chosenPlayer: PlayerId = move.data
    this.memorize(Memory.TeamFirst, chosenPlayer)

    const players = this.game.rule?.players ?? []
    return players.map((p) => this.endPlayerTurn(p))
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    const firstPlayer = this.remind<PlayerId>(Memory.TeamFirst)
    // Keep TeamFirst in memory so the speech bubble can display
    this.memorize(Memory.AlreadyPlayedPlayers, [])

    return [this.startPlayerTurn(RuleId.PlayCard, firstPlayer)]
  }
}
