/** @jsxImportSource @emotion/react */
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getFactionIcon } from '../../i18n/trans.components'

export const DevelopTechnologyLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const { t } = useTranslation()
  const move: MoveItem = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const parent = rules.material(MaterialType.TechnologyBoard).getItem(move.location.parent!)
  const playerName = usePlayerName(rules.getActivePlayer())

  return (
    <>
      <Trans
        i18nKey="log.develop.technology"
        values={{
          player: playerName,
          faction: t(`faction.${parent.location.id}`)
        }}
        components={{
          factionIcon: getFactionIcon(parent.location.id as Faction)
        }}
      />
    </>
  )
}
