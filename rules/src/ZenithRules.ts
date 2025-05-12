import {
  CompetitiveRank,
  hideItemId,
  hideItemIdToOthers,
  MaterialGame,
  MaterialMove,
  PositiveSequenceStrategy,
  SecretMaterialRules,
  TimeLimit
} from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { RuleId } from './rules/RuleId'
import { MulliganRule } from './rules/MulliganRule'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class ZenithRules
  extends SecretMaterialRules<PlayerId, MaterialType, LocationType>
  implements
    CompetitiveRank<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId>,
    TimeLimit<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>>
{
  rules = {
    [RuleId.Muligan]: MulliganRule
  }

  locationsStrategies = {
    [MaterialType.AgentCard]: {
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.AgentDeck]: new PositiveSequenceStrategy(),
      [LocationType.AgentDiscard]: new PositiveSequenceStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.AgentCard]: {
      [LocationType.PlayerHand]: hideItemIdToOthers,
      [LocationType.AgentDeck]: hideItemId
    }
  }

  rankPlayers(_playerA: PlayerId, _playerB: PlayerId): number {
    return 0
  }

  giveTime(): number {
    return 60
  }
}
