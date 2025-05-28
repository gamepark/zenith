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
    return this.material(MaterialType.ZenithiumToken).player(this.team).getQuantity()
  }
}
