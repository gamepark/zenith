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
import { DiscardActionRule } from './rules/DiscardActionRule'
import {
  ChoiceRule,
  ConditionalRule,
  DevelopTechnologyRule,
  DiscardRule,
  ExileRule,
  GiveCreditRule,
  GiveInfluenceRule,
  GiveLeaderBadgeRule,
  GiveZenithiumRule,
  MobilizeRule,
  ResetInfluenceRule,
  SpendCreditRule,
  TakeBonusRule,
  TakeLeaderBadgeRule,
  TransferRule,
  WinCreditRule,
  WinInfluenceRule,
  WinZenithiumRule
} from './rules/effect'
import { MulliganRule } from './rules/MulliganRule'
import { PlayCardRule } from './rules/PlayCardRule'
import { RefillRule } from './rules/RefillRule'
import { RuleId } from './rules/RuleId'

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
    [RuleId.Muligan]: MulliganRule,
    [RuleId.PlayCard]: PlayCardRule,
    [RuleId.DiscardAction]: DiscardActionRule,
    [RuleId.Transfer]: TransferRule,
    [RuleId.GiveCredit]: GiveCreditRule,
    [RuleId.WinCredit]: WinCreditRule,
    [RuleId.SpendCredit]: SpendCreditRule,
    [RuleId.Conditional]: ConditionalRule,
    [RuleId.WinZenithium]: WinZenithiumRule,
    [RuleId.GiveZenithium]: GiveZenithiumRule,
    [RuleId.Exile]: ExileRule,
    [RuleId.WinInfluence]: WinInfluenceRule,
    [RuleId.GiveInfluence]: GiveInfluenceRule,
    [RuleId.ResetInfluence]: ResetInfluenceRule,
    [RuleId.DevelopTechnology]: DevelopTechnologyRule,
    [RuleId.GiveLeaderBadge]: GiveLeaderBadgeRule,
    [RuleId.TakeLeaderBadge]: TakeLeaderBadgeRule,
    [RuleId.Discard]: DiscardRule,
    [RuleId.Mobilize]: MobilizeRule,
    [RuleId.Choice]: ChoiceRule,
    [RuleId.TakeBonus]: TakeBonusRule,
    [RuleId.Refill]: RefillRule
  }

  locationsStrategies = {
    [MaterialType.AgentCard]: {
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.AgentDeck]: new PositiveSequenceStrategy(),
      [LocationType.AgentDiscard]: new PositiveSequenceStrategy(),
      [LocationType.Influence]: new PositiveSequenceStrategy()
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
