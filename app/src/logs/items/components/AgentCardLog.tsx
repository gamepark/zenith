import { PlayMoveButton } from '@gamepark/react-game'
import { Agent } from '@gamepark/zenith/material/Agent'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

type AgentCardLogProps = {
  agent: Agent
}
export const AgentCardLog: FC<AgentCardLogProps> = ({ agent }) => {
  const { t } = useTranslation()
  return (
    <PlayMoveButton move={displayMaterialHelp(MaterialType.AgentCard, { id: agent })} transient>
      {t(`agent.${agent}`)}
    </PlayMoveButton>
  )
}
