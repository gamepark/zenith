import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { credits } from '../../material/Credit'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { getTeamColor, TeamColor } from '../../TeamColor'

export class PlayerHelper extends MaterialRulesPart {
  team: TeamColor

  constructor(
    game: MaterialGame,
    readonly playerId: PlayerId
  ) {
    super(game)
    this.team = getTeamColor(playerId)
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
}
