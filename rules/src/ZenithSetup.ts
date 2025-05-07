import { MaterialGameSetup } from '@gamepark/rules-api'
import { ZenithOptions } from './ZenithOptions'
import { ZenithRules } from './ZenithRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class ZenithSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, ZenithOptions> {
  Rules = ZenithRules

  setupMaterial(_options: ZenithOptions) {
    // TODO
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
