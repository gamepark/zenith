import { isMoveItemType, isStartPlayerTurn, isStartRule, ItemMove, MoveItem, PlayerTurnRule } from '@gamepark/rules-api'
import { Faction } from '../../material/Faction'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { EffectHelper } from '../helper/EffectHelper'
import { PlayerHelper } from '../helper/PlayerHelper'
import { Memory } from '../Memory'
import { RuleId } from '../RuleId'
import { getDiplomacyActions } from './DiplomacyActions'
import { getTechnologyAction } from './TechnologyActions'

export class TechnologyBoardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const marker = this.marker
    if (marker.getItem()!.location.x! >= 5) return []
    return this.marker.moveItems((item) => ({ ...item.location, x: item.location.x! + 1 }))
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.TechMarker)(move)) return []
    const effectMoves = this.applyTechnology(move)
    if (effectMoves.some((move) => isStartRule(move) || isStartPlayerTurn(move))) {
      console.log(effectMoves)
      return effectMoves
    }

    return [this.startRule(RuleId.Refill)]
  }

  applyTechnology(move: MoveItem) {
    this.memorize(Memory.Effects, JSON.parse(JSON.stringify(getDiplomacyActions(this.game.players.length)[this.faction])))
    const board = this.material(MaterialType.TechnologyBoard).location(LocationType.TechnologyBoardPlace).locationId(this.faction).getItem<string>()!
    const boardId = board.id
    const actions = getTechnologyAction(boardId)
    this.memorize(Memory.Effects, JSON.parse(JSON.stringify(actions.slice(0, move.location.x).reverse().flat())))
    return new EffectHelper(this.game, this.player).applyFirstEffect()
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
