import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { credits } from '../../material/Credit'
import { Faction } from '../../material/Faction'
import { Influence } from '../../material/Influence'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { PlayerSide, TeamColor } from '../../TeamColor'
import { Memory } from '../Memory'

const TechnologySidePlanets = [Influence.Mercury, Influence.Venus, Influence.Terra]
const DiplomacySidePlanets = [Influence.Terra, Influence.Mars, Influence.Jupiter]

export class PlayerHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly playerId: PlayerId
  ) {
    super(game)
  }

  get team(): TeamColor {
    return this.remind<TeamColor>(Memory.Team, this.playerId)
  }

  get teammate(): PlayerId | undefined {
    return this.game.players.find((p) => p !== this.playerId && new PlayerHelper(this.game, p).team === this.team)
  }

  get side(): PlayerSide {
    const seatIndex = this.game.players.indexOf(this.playerId)
    return seatIndex <= 1 ? PlayerSide.Technology : PlayerSide.Diplomacy
  }

  get allowedPlanets(): Influence[] {
    return this.side === PlayerSide.Technology ? TechnologySidePlanets : DiplomacySidePlanets
  }

  get credits() {
    return this.material(MaterialType.CreditToken).money(credits).player(this.team).count
  }

  get zenithium() {
    return this.zenithiumMaterial.getQuantity()
  }

  get zenithiumMaterial() {
    return this.material(MaterialType.ZenithiumToken).player(this.team)
  }

  get isLeader() {
    return this.material(MaterialType.LeaderBadgeToken).player(this.team).length > 0
  }

  canDevelopTechnology(faction: Faction) {
    const board = this.material(MaterialType.TechnologyBoard).location(LocationType.TechnologyBoardPlace).locationId(faction)
    const marker = this.material(MaterialType.TechMarker).location(LocationType.TechnologyBoardTokenSpace).player(this.team).parent(board.getIndex())
    const item = marker.getItem()
    if (!item || item.location.x! >= 5) return false
    return this.zenithium >= item.location.x! + 1
  }
}
