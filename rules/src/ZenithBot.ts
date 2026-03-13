import { MaterialGame, MaterialMove, RandomBot } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'

export class ZenithBot extends RandomBot<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId> {
  constructor(playerId: PlayerId) {
    super(ZenithRulesImport, playerId)
  }
}

// Lazy import to avoid circular dependency
import { ZenithRules as ZenithRulesImport } from './ZenithRules'
