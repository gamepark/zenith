/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { LogTransComponents } from '../../i18n/trans.components'

export const GiveLeaderBadgeLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const move = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const activePlayer = rules.getActivePlayer()!
  const playerName = usePlayerName(activePlayer)

  return (
    <Trans
      i18nKey="log.give.leaderBadge"
      values={{
        player: playerName,
        team: t(`team.${getTeamColor(activePlayer)}`),
        targetTeam: t(`team.${move.location.player}`)
      }}
      components={LogTransComponents}
    />
  )
}
