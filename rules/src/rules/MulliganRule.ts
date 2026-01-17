import { CustomMove, isCustomMoveType, isMoveItemType, MaterialMove, MoveItem, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { getTeamColor, TeamColor } from '../TeamColor'
import { CustomMoveType } from './CustomMoveType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class MulliganRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: PlayerId): MaterialMove[] {
    return [
      ...this.getHand(player).moveItems({
        type: LocationType.AgentDiscard
      }),
      this.customMove(CustomMoveType.Pass, player)
    ]
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(CustomMoveType.Pass)(move)) return []
    const player: PlayerId = move.data
    const mulliganCount = this.getMulliganCount(player)
    const moves: MaterialMove[] = []

    if (mulliganCount) {
      const deck = this.deck
      moves.push(
        deck.dealAtOnce(
          {
            type: LocationType.PlayerHand,
            player: player
          },
          mulliganCount
        )
      )
    }

    moves.push(this.endPlayerTurn(player))

    return moves
  }

  getMulliganCount(player: PlayerId) {
    return this.remind<number | undefined>(Memory.Mulligan, player) ?? 0
  }

  get deck() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
  }

  beforeItemMove(move: MoveItem) {
    if (!isMoveItemType(MaterialType.AgentCard)(move) || move.location.type !== LocationType.AgentDiscard) return []
    const item = this.material(MaterialType.AgentCard).getItem(move.itemIndex)
    const player: PlayerId = item.location.player!
    const mulliganCount = this.getMulliganCount(player)
    this.memorize(Memory.Mulligan, mulliganCount + 1, player)
    return []
  }

  getHand(playerId: PlayerId) {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(playerId)
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    for (const player of this.game.players) {
      this.forget(Memory.Mulligan, player)
    }

    if (this.game.players.length === 4) {
      const currentTeam = this.remind<TeamColor>(Memory.CurrentTeam)
      const teamPlayers = this.game.players.filter(p => getTeamColor(p) === currentTeam)
      return [this.startSimultaneousRule(RuleId.PickOrder, teamPlayers)]
    }

    // 2 players: use first player from TurnOrder
    return [this.startPlayerTurn(RuleId.PlayCard, this.turnOrder[0])]
  }

  get turnOrder(): PlayerId[] {
    return this.remind<PlayerId[]>(Memory.TurnOrder)
  }
}
