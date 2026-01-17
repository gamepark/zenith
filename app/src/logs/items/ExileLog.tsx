import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { ExileRule } from '@gamepark/zenith/rules/effect'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { AgentCardLog } from './components/AgentCardLog'

export const ExileLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move: MoveItem = props.move as MoveItem
  const { t } = useTranslation()
  const rules = new ExileRule(context.game as MaterialGame)
  const item = rules.material(MaterialType.AgentCard).getItem(move.itemIndex)
  const itemId = item.id
  const activePlayer = rules.getActivePlayer()
  const playerName = usePlayerName(activePlayer)
  const team = getTeamColor(activePlayer)
  const opponentTeam = team === TeamColor.Black ? TeamColor.White : TeamColor.Black
  const effect = rules.effect
  return (
    <>
      <Trans
        i18nKey={effect.opponent ? 'log.exile.opponent' : 'log.exile'}
        values={{
          player: playerName,
          team: t(`team.${opponentTeam}`)
        }}
        components={{
          agent: <AgentCardLog agent={itemId} />
        }}
      />
    </>
  )
}
