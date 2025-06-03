import { Material, MaterialGame, MaterialRulesPart } from '@gamepark/rules-api'
import { PlayerId } from '../../PlayerId'

export class EffectHelper extends MaterialRulesPart {
  constructor(
    game: MaterialGame,
    readonly player: PlayerId
  ) {
    super(game)
  }

  applyCard(card: Material) {}
}
