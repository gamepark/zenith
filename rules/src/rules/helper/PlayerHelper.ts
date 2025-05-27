import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { credits } from '../../material/Credit'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { getTeamColor } from '../../TeamColor'

export class PlayerHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly playerId: PlayerId
  ) {
    super(game)
  }

  get credits() {
    return this.material(MaterialType.CreditToken).money(credits).player(this.team).count
  }

  get team() {
    return getTeamColor(this.playerId)
  }
}
