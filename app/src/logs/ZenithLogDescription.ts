import { css } from '@emotion/react'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isCreateItemType, isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { Effect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { DevelopTechnologyLog } from './items/DevelopTechnologyLog'
import { DiplomacyLog } from './items/DiplomacyLog'
import { DiscardLog } from './items/DiscardLog'
import { GiveInfluenceLog } from './items/GiveInfluenceLog'
import { InfluenceLog } from './items/InfluenceLog'
import { RecruitLog } from './items/RecruitLog'
import { TakeLeaderBadgeLog } from './items/TakeLeaderBadgeLog'
import { WinCreditLog } from './items/WinCreditLog'
import { WinZenithiumLog } from './items/WinZenithiumLog'

export class ZenithLogDescription implements LogDescription<MaterialMove, PlayerId, MaterialGame> {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext<MaterialMove, PlayerId, MaterialGame>): MovePlayedLogDescription | undefined {
    if (context.game.rule?.id === RuleId.PlayCard) {
      if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
        return {
          player: context.game.rule.player,
          Component: RecruitLog
        }
      }

      if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.AgentDiscard) {
        return {
          player: context.game.rule.player,
          Component: DiscardLog
        }
      }
    }

    if (context.game.rule?.id === RuleId.DiscardAction) {
      if (isMoveItemType(MaterialType.TechMarker)(move)) {
        return {
          depth: 1,
          Component: DevelopTechnologyLog,
          css: depthCss
        }
      }

      if (isCustomMoveType(CustomMoveType.Diplomacy)(move)) {
        return {
          depth: 1,
          Component: DiplomacyLog,
          css: depthCss
        }
      }
    }

    if (context.game.rule?.id === RuleId.WinZenithium && isCreateItemType(MaterialType.ZenithiumToken)(move)) {
      return {
        depth: 1,
        Component: WinZenithiumLog,
        css: depthCss
      }
    }

    if (
      context.game.rule?.id === RuleId.WinInfluence &&
      isMoveItemType(MaterialType.InfluenceDisc)(move) &&
      move.location.type === LocationType.PlanetBoardInfluenceDiscSpace
    ) {
      return {
        depth: 1,
        Component: InfluenceLog,
        css: depthCss
      }
    }

    if (context.game.rule?.id === RuleId.TakeLeaderBadge && isMoveItemType(MaterialType.LeaderBadgeToken)(move)) {
      console.log('TAKE')
      return {
        depth: 1,
        Component: TakeLeaderBadgeLog,
        css: depthCss
      }
    }

    if (isCustomMoveType(CustomMoveType.WinCreditLog)(move)) {
      if (move.data > 0) {
        return {
          depth: 1,
          Component: WinCreditLog,
          css: depthCss
        }
      }
    }

    if (
      context.game.rule?.id === RuleId.GiveInfluence &&
      isMoveItemType(MaterialType.InfluenceDisc)(move) &&
      move.location.type === LocationType.PlanetBoardInfluenceDiscSpace
    ) {
      const effects: Effect[] = context.game.memory[Memory.Effects] ?? []
      const firstEffect = effects[0]
      if (firstEffect.type === EffectType.Conditional) {
        return {
          player: context.game.rule.player,
          Component: GiveInfluenceLog
        }
      } else {
        return {
          depth: 1,
          Component: GiveInfluenceLog,
          css: depthCss
        }
      }
    }

    return
  }
}

const depthCss = css`
  > div:last-of-type {
    display: flex;
    align-items: center;
  }
`
