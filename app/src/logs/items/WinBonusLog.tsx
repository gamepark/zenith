import { MoveComponentProps, Picture, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MaterialMoveBuilder, MoveItem } from '@gamepark/rules-api'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { bonusTokenDescription } from '../../material/BonusTokenDescription'
import { pictureCss } from './trans.components'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const WinBonusLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move: MoveItem = props.move as MoveItem
  const rules = new ZenithRules(context.game as MaterialGame)
  const item = rules.material(MaterialType.BonusToken).getItem(move.itemIndex)
  const itemId: Bonus = item.id ?? move.reveal?.id
  const playerName = usePlayerName(rules.getActivePlayer())

  return (
    <>
      <Trans
        defaults={item.location.type === LocationType.BonusTokenStock ? 'log.bonus.draw' : 'log.bonus.take'}
        values={{
          player: playerName
        }}
        components={{
          bonus: <BonusItem itemId={itemId} />
        }}
      />
    </>
  )
}

const BonusItem = ({ itemId }: { itemId: Bonus }) => {
  return (
    <PlayMoveButton move={displayMaterialHelp(MaterialType.BonusToken, { id: itemId })} transient>
      <Picture src={bonusTokenDescription.images[itemId]} css={pictureCss(true)} />
    </PlayMoveButton>
  )
}
