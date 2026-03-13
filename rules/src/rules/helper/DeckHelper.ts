import { MaterialGame, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class DeckHelper extends MaterialRulesPart {
  constructor(game: MaterialGame) {
    super(game)
  }

  get deck() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDeck).deck()
  }

  get discard() {
    return this.material(MaterialType.AgentCard).location(LocationType.AgentDiscard)
  }

  shuffleDeck(): MaterialMove {
    return this.deck.shuffle()
  }

  reshuffleDiscardIfDeckEmpty(): MaterialMove[] {
    if (!this.deck.length && this.discard.length) {
      return [this.discard.moveItemsAtOnce({ type: LocationType.AgentDeck })]
    }
    return []
  }
}
