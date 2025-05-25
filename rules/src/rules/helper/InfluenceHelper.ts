import { MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { PlayerId } from '../../PlayerId'

export class InfluenceHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly playerId: PlayerId
  ) {
    super(game)
  }
}
