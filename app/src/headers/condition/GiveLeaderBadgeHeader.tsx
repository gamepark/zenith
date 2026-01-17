import { PlayMoveButton, useLegalMove, useRules } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType, isMoveItemType, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { ConditionalEffect, ExpandedEffect, GiveLeaderBadgeEffect } from '@gamepark/zenith/material/effect/Effect'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { Trans } from 'react-i18next'
import { HeaderTransComponents } from '../../i18n/trans.components'
import { EffectSource } from '../EffectSource'
import { headerPictureCss } from '../header.css'
import { useDoConditionHeaderContext } from './condition.utils'

export const GiveLeaderBadgeHeader = () => {
  const { itsMe, name } = useDoConditionHeaderContext<GiveLeaderBadgeEffect>()
  const rules = useRules<MaterialRules>()!
  const effect = rules.remind<ExpandedEffect[]>(Memory.Effects)[0] as ExpandedEffect<ConditionalEffect>
  const badge = rules.material(MaterialType.LeaderBadgeToken).getItem()!

  const source = <EffectSource effectSource={effect.effectSource} />
  const components = {
    ...HeaderTransComponents,
    source,
    leaderBadge: HeaderTransComponents.leaderSilver
  }

  // Legal Moves
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))

  const give = useLegalMove<CustomMove>(
    (move: MaterialMove) => isMoveItemType(MaterialType.LeaderBadgeToken)(move) && move.location.player !== badge.location.player
  )!

  return (
    <Trans
      i18nKey={itsMe ? 'header.condition.give-leader-badge' : 'header.condition.give-leader-badge.player'}
      values={{
        player: name
      }}
      components={{
        ...components,
        pass: <PlayMoveButton move={pass} />,
        give: <PlayMoveButton move={give} css={headerPictureCss} />
      }}
    />
  )
}
