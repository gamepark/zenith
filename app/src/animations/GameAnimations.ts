import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { RuleId } from '@gamepark/zenith/rules/RuleId'

export const gameAnimations = new MaterialGameAnimations()

// Influence disc movements - slower for satisfaction
gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.InfluenceDisc)(move))
  .duration(0.8)

// Card plays
gameAnimations
  .when()
  .rule(RuleId.PlayCard)
  .move((move) => isMoveItemType(MaterialType.AgentCard)(move))
  .duration(0.4)

// Mulligan - faster card distribution
gameAnimations
  .when()
  .rule(RuleId.Muligan)
  .move((move) => isMoveItemType(MaterialType.AgentCard)(move))
  .duration(0.3)

// Discard actions
gameAnimations
  .when()
  .rule(RuleId.Discard)
  .move((move) => isMoveItemType(MaterialType.AgentCard)(move))
  .duration(0.35)

// Credit/Zenithium token movements
gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.CreditToken)(move) || isMoveItemType(MaterialType.ZenithiumToken)(move))
  .duration(0.4)

// Leader badge transfer
gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.LeaderBadgeToken)(move))
  .duration(0.6)

// Technology markers
gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.TechMarker)(move))
  .duration(0.5)

// Refill deck
gameAnimations
  .when()
  .rule(RuleId.Refill)
  .move((move) => isMoveItemType(MaterialType.AgentCard)(move))
  .duration(0.25)
