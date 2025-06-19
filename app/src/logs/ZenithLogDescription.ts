import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { RuleId } from '@gamepark/zenith/rules/RuleId'
import { RecruitLog } from './items/RecruitLog'

export class ZenithLogDescription implements LogDescription<MaterialMove, PlayerId, MaterialGame> {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext<MaterialMove, PlayerId, MaterialGame>): MovePlayedLogDescription | undefined {
    if (context.game.rule?.id === RuleId.PlayCard) {
      if (isMoveItemType(MaterialType.AgentCard)(move) && move.location.type === LocationType.Influence) {
        return {
          player: context.game.rule.player,
          Component: RecruitLog
        }
      }
    }

    return
  }
}
