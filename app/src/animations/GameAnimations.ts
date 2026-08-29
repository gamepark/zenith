import { and, isRule, MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { RuleId } from '@gamepark/zenith/rules/RuleId'

export const gameAnimations = new MaterialGameAnimations()

// Influence disc movements - slower for satisfaction
gameAnimations
  .configure((move) => isMoveItemType(MaterialType.InfluenceDisc)(move))
  .duration(1200)

// Card plays
gameAnimations
  .configure(and(isRule(RuleId.PlayCard), (move) => isMoveItemType(MaterialType.AgentCard)(move)))
  .duration(800)

// Mulligan - faster card distribution
gameAnimations
  .configure(and(isRule(RuleId.Muligan), (move) => isMoveItemType(MaterialType.AgentCard)(move)))
  .duration(500)

// Discard actions
gameAnimations
  .configure(and(isRule(RuleId.Discard), (move) => isMoveItemType(MaterialType.AgentCard)(move)))
  .duration(600)

// Credit/Zenithium token movements
gameAnimations
  .configure((move) => isMoveItemType(MaterialType.CreditToken)(move) || isMoveItemType(MaterialType.ZenithiumToken)(move))
  .duration(700)

// Leader badge transfer
gameAnimations
  .configure((move) => isMoveItemType(MaterialType.LeaderBadgeToken)(move))
  .duration(1000)

// Technology markers
gameAnimations
  .configure((move) => isMoveItemType(MaterialType.TechMarker)(move))
  .duration(800)

// Refill deck
gameAnimations
  .configure(and(isRule(RuleId.Refill), (move) => isMoveItemType(MaterialType.AgentCard)(move)))
  .duration(400)
