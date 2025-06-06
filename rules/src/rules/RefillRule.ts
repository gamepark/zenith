import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { influences } from '../material/Influence'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { PlayerHelper } from './helper/PlayerHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class RefillRule extends PlayerTurnRule {
  onRuleStart() {
    const leaderBadge = this.leaderBadge
    this.memorize(Memory.AlreadyPlayedPlayers, (p: PlayerId[] = []) => p.concat(this.player))
    const moves: MaterialMove[] = []

    for (const influence of influences) {
      const planet = this.material(MaterialType.InfluenceDisc).location(LocationType.PlanetBoardInfluenceDiscSpace).locationId(influence)
      if (planet.length) continue
      moves.push(
        this.material(MaterialType.InfluenceDisc).createItem({
          id: influence,
          location: {
            type: LocationType.PlanetBoardInfluenceDiscSpace,
            id: influence,
            x: 0
          }
        })
      )
    }

    if (!leaderBadge.length) {
      moves.push(...this.refillHand(4))
    } else {
      const item = leaderBadge.getItem()!
      if (!item.location.rotation) {
        moves.push(...this.refillHand(5))
      } else {
        moves.push(...this.refillHand(6))
      }
    }

    /*
     * TODO: next player at 4-players is a choice
     */
    const isTurnEnded = this.remind<PlayerId[]>(Memory.AlreadyPlayedPlayers).length === this.game.players.length
    if (isTurnEnded) {
      this.forget(Memory.AlreadyPlayedPlayers)
      // TODO: GO to order choice
      moves.push(this.startPlayerTurn(RuleId.PlayCard, this.game.players[0]))
    } else {
      moves.push(this.startPlayerTurn(RuleId.PlayCard, this.nextPlayer))
    }

    return moves
  }

  refillHand(maxCount: number) {
    const deck = this.deck
    return deck.deal(
      {
        type: LocationType.PlayerHand,
        player: this.player
      },
      maxCount - this.hand.length
    )
  }

  get hand() {
    return this.material(MaterialType.AgentCard).location(LocationType.PlayerHand).player(this.player)
  }

  get deck() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
  }

  get leaderBadge() {
    return this.material(MaterialType.LeaderBadgeToken).player(new PlayerHelper(this.game, this.player).team)
  }
}
