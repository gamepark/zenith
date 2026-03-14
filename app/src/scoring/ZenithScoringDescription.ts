import { ScoringDescription } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { ZenithResultHeader } from './ZenithResultHeader'

export class ZenithScoringDescription implements ScoringDescription<PlayerId, MaterialRules> {
  ResultHeader = ZenithResultHeader

  getScoringKeys() {
    return []
  }

  getScoringHeader() {
    return ''
  }

  getScoringPlayerData() {
    return null
  }
}
