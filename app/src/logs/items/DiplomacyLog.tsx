/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { DiplomacyBoardRule } from '@gamepark/zenith/rules/discard-action/DiplomacyBoardRule'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getFactionIcon } from '../../i18n/trans.components'

export const DiplomacyLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const rules = new DiplomacyBoardRule(context.game as MaterialGame)
  const faction = rules.faction
  const playerName = usePlayerName(rules.getActivePlayer())

  return (
    <>
      <Trans
        i18nKey="log.diplomacy"
        values={{
          player: playerName,
          faction: t(`faction.${faction}`)
        }}
        components={{
          factionIcon: getFactionIcon(faction)
        }}
      />
    </>
  )
}
