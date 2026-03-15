/** @jsxImportSource @emotion/react */
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemContext, ItemMenuButton, TokenDescription } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Trans } from 'react-i18next'
import LeaderGold from '../images/leader/LeaderGold.png'
import LeaderSilver from '../images/leader/LeaderSilver.png'
import LeaderGoldIcon from '../images/icons/leader-gold.png'
import LeaderSilverIcon from '../images/icons/leader-silver.png'
import { LeaderBadgeHelp } from './LeaderBadgeHelp'

export class LeaderBadgeDescription extends TokenDescription {
  help = LeaderBadgeHelp
  width = 5.8
  height = 4.06
  borderRadius = 1.5
  image = LeaderSilver
  backImage = LeaderGold
  menuAlwaysVisible = true

  isFlipped(item: Partial<MaterialItem>) {
    return !!item.location?.rotation
  }

  transparency = true

  getImages(): string[] {
    const images = super.getImages()
    images.push(LeaderSilverIcon)
    images.push(LeaderGoldIcon)
    return images
  }

  getItemMenu(_item: MaterialItem, _context: ItemContext, legalMoves: MaterialMove[]) {
    const give = legalMoves.find(m => isMoveItemType(MaterialType.LeaderBadgeToken)(m))
    if (!give) return
    const pass = legalMoves.find(m => isCustomMoveType(CustomMoveType.Pass)(m))
    return (
      <>
        {give && (
          <ItemMenuButton move={give} x={-1.5} y={-2.7} label={<Trans i18nKey="help.action.share" />}>
            <FontAwesomeIcon icon={faArrowUp} />
          </ItemMenuButton>
        )}
        {pass && (
          <ItemMenuButton move={pass} x={-1.5} y={2.7} label={<Trans i18nKey="help.action.pass" />}>
            <FontAwesomeIcon icon={faXmark} />
          </ItemMenuButton>
        )}
      </>
    )
  }
}

export const leaderBadgeDescription = new LeaderBadgeDescription()
