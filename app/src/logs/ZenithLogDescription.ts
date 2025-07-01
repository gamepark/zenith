import { css } from '@emotion/react'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isCreateItemType, isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { Agent } from '@gamepark/zenith/material/Agent'
import { ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { DevelopTechnologyLog } from './items/DevelopTechnologyLog'
import { DiplomacyLog } from './items/DiplomacyLog'
import { DiscardActionLog } from './items/DiscardActionLog'
import { DiscardEffectLog } from './items/DiscardEffectLog'
import { ExileLog } from './items/ExileLog'
import { GiveInfluenceLog } from './items/GiveInfluenceLog'
import { InfluenceLog } from './items/InfluenceLog'
import { MobilizeLog } from './items/MobilizeLog'
import { RecruitLog } from './items/RecruitLog'
import { TakeLeaderBadgeLog } from './items/TakeLeaderBadgeLog'
import { TransfertLog } from './items/TransfertLog'
import { WinBonusLog } from './items/WinBonusLog'
import { WinCreditLog } from './items/WinCreditLog'
import { WinPlanetLog } from './items/WinPlanetLog'
import { WinZenithiumLog } from './items/WinZenithiumLog'

export class ZenithLogDescription implements LogDescription<MaterialMove, PlayerId, MaterialGame> {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext<MaterialMove, PlayerId, MaterialGame>): MovePlayedLogDescription | undefined {
    if (context.game.rule?.id === RuleId.PlayCard) {
      if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
        const player = context.game.rule.player!
        return {
          player: player,
          Component: RecruitLog,
          css: colorCss(player)
        }
      }

      if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard) {
        const player = context.game.rule.player!
        return {
          player: player,
          Component: DiscardActionLog,
          css: colorCss(player)
        }
      }
    }

    if (
      isMoveItemType(MaterialType.AgentCard)(move) &&
      move.location.type === LocationType.AgentDiscard &&
      (context.game.rule?.id === RuleId.Conditional || context.game.rule?.id === RuleId.Discard)
    ) {
      const item = new ZenithRules(context.game).material(MaterialType.AgentCard).getItem(move.itemIndex)
      const player = context.game.rule.player!
      if (item.location.type === LocationType.PlayerHand) {
        return {
          depth: 1,
          Component: DiscardEffectLog,
          css: colorCss(player)
        }
      }
    }

    if (
      isMoveItemType(MaterialType.AgentCard)(move) &&
      move.location.type === LocationType.AgentDiscard &&
      (context.game.rule?.id === RuleId.Conditional || context.game.rule?.id === RuleId.Exile)
    ) {
      const item = new ZenithRules(context.game).material(MaterialType.AgentCard).getItem(move.itemIndex)
      const player = context.game.rule.player!
      if (item.location.type === LocationType.Influence) {
        return {
          depth: 1,
          Component: ExileLog,
          css: colorCss(player)
        }
      }
    }

    if (isMoveItemType(MaterialType.BonusToken)(move) && move.location.type === LocationType.BonusDiscard) {
      const player = context.game.rule!.player!
      return {
        depth: 1,
        Component: WinBonusLog,
        css: colorCss(player)
      }
    }

    if (context.game.rule?.id === RuleId.DiscardAction || context.game.rule?.id === RuleId.DevelopTechnology) {
      const player = context.game.rule.player!
      if (isMoveItemType(MaterialType.TechMarker)(move)) {
        return {
          depth: 1,
          Component: DevelopTechnologyLog,
          css: colorCss(player)
        }
      }

      if (isCustomMoveType(CustomMoveType.Diplomacy)(move)) {
        return {
          depth: 1,
          Component: DiplomacyLog,
          css: colorCss(player)
        }
      }
    }

    if (context.game.rule?.id === RuleId.WinZenithium && isCreateItemType(MaterialType.ZenithiumToken)(move)) {
      const player = context.game.rule.player!
      return {
        depth: 1,
        Component: WinZenithiumLog,
        css: colorCss(player)
      }
    }

    if (
      context.game.rule?.id === RuleId.WinInfluence &&
      isMoveItemType(MaterialType.InfluenceDisc)(move) &&
      move.location.type === LocationType.PlanetBoardInfluenceDiscSpace
    ) {
      const player = context.game.rule.player!
      return {
        depth: 1,
        Component: InfluenceLog,
        css: colorCss(player)
      }
    }

    if (isMoveItemType(MaterialType.InfluenceDisc)(move) && move.location.type === LocationType.TeamPlanets) {
      const player = context.game.rule!.player!
      return {
        depth: 1,
        Component: WinPlanetLog,
        css: colorCss(player)
      }
    }

    if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
      const item = new ZenithRules(context.game).material(MaterialType.AgentCard).getItem<Agent | undefined>(move.itemIndex)
      const player = context.game.rule!.player!
      if (item.location.type === LocationType.Influence && item.location.player !== move.location.player) {
        return {
          depth: 1,
          Component: TransfertLog,
          css: colorCss(player)
        }
      }

      if (item.location.type === LocationType.AgentDeck) {
        return {
          depth: 1,
          Component: MobilizeLog,
          css: colorCss(player)
        }
      }
    }

    if (context.game.rule?.id === RuleId.TakeLeaderBadge && isMoveItemType(MaterialType.LeaderBadgeToken)(move)) {
      const player = context.game.rule.player!
      return {
        depth: 1,
        Component: TakeLeaderBadgeLog,
        css: colorCss(player)
      }
    }

    if (isCustomMoveType(CustomMoveType.WinCreditLog)(move)) {
      const player = context.game.rule!.player!
      if (move.data > 0) {
        return {
          depth: 1,
          Component: WinCreditLog,
          css: colorCss(player)
        }
      }
    }

    if (
      context.game.rule?.id === RuleId.GiveInfluence &&
      isMoveItemType(MaterialType.InfluenceDisc)(move) &&
      move.location.type === LocationType.PlanetBoardInfluenceDiscSpace
    ) {
      const effects: ExpandedEffect[] = context.game.memory[Memory.Effects] ?? []
      const firstEffect = effects[0]
      const player = context.game.rule.player!
      if (firstEffect.type === EffectType.Conditional) {
        return {
          player: player,
          Component: GiveInfluenceLog,
          css: colorCss(player)
        }
      } else {
        return {
          depth: 1,
          Component: GiveInfluenceLog,
          css: colorCss(player)
        }
      }
    }

    return
  }
}

const getTeamCss = (player: PlayerId) => {
  const team = getTeamColor(player)
  if (team === TeamColor.Black) {
    return
  }

  return css`
    color: black;
    background-color: white;
    border: 0.1em solid black;
  `
}

const colorCss = (player: PlayerId) => {
  const teamCss = getTeamCss(player)
  return css`
    picture,
    img {
      height: 2em;
    }
    width: calc(100% - 0.2em);
    > div:last-of-type {
      display: flex;
      align-items: center;
    }

    ${teamCss}
    > div:first-of-type {
      margin-top: 0;
    }
  `
}
