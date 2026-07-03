import { MoveComponentProps, Picture, PlayMoveButton } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MaterialMoveBuilder, MoveItem } from '@gamepark/rules-api'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { Influence } from '@gamepark/zenith/material/Influence'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { bonusTokenDescription } from '../../material/BonusTokenDescription'
import { pictureCss } from '../../i18n/trans.components'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

/**
 * The team that receives a bonus: the team that captured the planet it sat on (which may be
 * the opponent of the active player, when a "given" planet is captured); or, for bonuses
 * drawn from stock / a technology board, the active player's team.
 */
export const getBonusWinningTeam = (game: MaterialGame, move: MoveItem): TeamColor => {
  const rules = new ZenithRules(game)
  const token = rules.material(MaterialType.BonusToken).getItem(move.itemIndex)
  if (token.location.type === LocationType.PlanetBoardBonusSpace && token.location.id !== undefined) {
    const disc = rules.material(MaterialType.InfluenceDisc).id(token.location.id as Influence).getItem()
    if (disc?.location.type === LocationType.TeamPlanets && disc.location.player !== undefined) {
      return disc.location.player as TeamColor
    }
  }
  return new PlayerHelper(game, rules.getActivePlayer()).team
}

export const WinBonusLog: FC<MoveComponentProps<MaterialMove>> = (props) => {
  const { context } = props
  const move: MoveItem = props.move as MoveItem
  const { t } = useTranslation()
  const game = context.game as MaterialGame
  const rules = new ZenithRules(game)
  const item = rules.material(MaterialType.BonusToken).getItem(move.itemIndex)
  const itemId: Bonus = item.id ?? move.reveal?.id
  const winningTeam = getBonusWinningTeam(game, move)

  return (
    <>
      <Trans
        i18nKey={item.location.type === LocationType.BonusTokenStock ? 'log.bonus.draw' : 'log.bonus.take'}
        values={{
          team: t(`team.${winningTeam}`)
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
