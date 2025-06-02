import { isMoveItemType, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Faction } from '../../material/Faction'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerHelper } from '../helper/PlayerHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class TechnologyBoardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const marker = this.marker
    if (marker.getItem()!.location.x! >= 5) return []
    return this.marker.moveItems((item) => ({ ...item.location, x: item.location.x! + 1 }))
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.TechMarker)(move)) return []
    return [this.startPlayerTurn(RuleId.PlayCard, this.nextPlayer)]
  }

  get marker() {
    const playerHelper = new PlayerHelper(this.game, this.player)
    const board = this.material(MaterialType.TechnologyBoard).location(LocationType.TechnologyBoardPlace).locationId(this.faction)

    return this.material(MaterialType.TechMarker).location(LocationType.TechnologyBoardTokenSpace).player(playerHelper.team).parent(board.getIndex())
  }

  get faction() {
    return this.remind<Faction>(Memory.DiscardFaction)
  }
}
