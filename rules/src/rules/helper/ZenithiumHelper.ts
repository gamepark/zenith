import { MaterialGame, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'
import { PlayerHelper } from './PlayerHelper'

export class ZenithiumHelper extends MaterialRulesPart {
  private playerHelper: PlayerHelper

  constructor(
    game: MaterialGame,
    readonly player: PlayerId
  ) {
    super(game)
    this.playerHelper = new PlayerHelper(game, player)
  }

  winZenithium(count = 1): MaterialMove[] {
    return [
      this.material(MaterialType.ZenithiumToken).createItem({
        location: {
          type: LocationType.TeamZenithium,
          player: this.playerHelper.team
        },
        quantity: count
      })
    ]
  }

  giveZenithium(to: PlayerId, count = 1): MaterialMove[] {
    return this.material(MaterialType.ZenithiumToken)
      .location(LocationType.TeamZenithium)
      .player(this.playerHelper.team)
      .moveItems(
        {
          type: LocationType.TeamZenithium,
          player: new PlayerHelper(this.game, to).team
        },
        count
      )
  }

  spendZenithium(count = 1): MaterialMove[] {
    return this.material(MaterialType.ZenithiumToken).location(LocationType.TeamZenithium).player(this.playerHelper.team).deleteItems(count)
  }
}
