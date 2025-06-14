import { isMoveItemType, isStartPlayerTurn, isStartRule, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { Faction } from '../../material/Faction'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectHelper } from '../helper/EffectHelper'
import { PlayerHelper } from '../helper/PlayerHelper'
import { TechnologyHelper } from '../helper/TechnologyHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'

export class TechnologyBoardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const marker = this.marker
    const item = marker.getItem()!
    if (item.location.x! >= 5) return []
    const zenithiumCost = item.location.x! + 1
    if (new PlayerHelper(this.game, this.player).zenithium < zenithiumCost) return []
    return this.marker.moveItems((item) => ({ ...item.location, x: item.location.x! + 1 }))
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.TechMarker)(move)) return []
    const moves: MaterialMove[] = new TechnologyHelper(this.game).applyTechnology(move)
    moves.push(new PlayerHelper(this.game, this.player).zenithiumMaterial.deleteItem(move.location.x))
    const effectMoves = new EffectHelper(this.game, this.player).applyFirstEffect()
    if (effectMoves.some((move) => isStartRule(move) || isStartPlayerTurn(move))) {
      moves.push(...effectMoves)
      return moves
    }

    moves.push(this.startRule(RuleId.Refill))
    return moves
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
