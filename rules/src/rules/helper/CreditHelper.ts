import { MaterialGame, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { credits } from '../../material/Credit'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { PlayerHelper } from './PlayerHelper'

export class CreditHelper extends MaterialRulesPart {
  private playerHelper: PlayerHelper

  constructor(
    game: MaterialGame,
    readonly player: PlayerId
  ) {
    super(game)
    this.playerHelper = new PlayerHelper(game, player)
  }

  get creditMoney() {
    return this.material(MaterialType.CreditToken).money(credits)
  }

  spendCredit(count = 1): MaterialMove[] {
    return this.creditMoney.removeMoney(count, { type: LocationType.TeamCredit, player: this.playerHelper.team })
  }
}
