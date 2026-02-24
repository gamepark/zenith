/** @jsxImportSource @emotion/react */
import { faHandBackFist } from '@fortawesome/free-solid-svg-icons/faHandBackFist'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemContext, ItemMenuButton, TokenDescription } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { Trans } from 'react-i18next'
import { BonusTokenHelp } from './BonusTokenHelp'
import BonusBack from '../images/bonuses/BonusBack.jpg'
import Exile2OpponentCards from '../images/bonuses/Exile2OpponentCards.jpg'
import Mobilize2 from '../images/bonuses/Mobilize2.jpg'
import TakeLeaderBadge from '../images/bonuses/TakeLeaderBadge.jpg'
import Transfer from '../images/bonuses/Transfer.jpg'
import Win1Zenithium from '../images/bonuses/Win1Zenithium.jpg'
import Win3Credit from '../images/bonuses/Win3Credit.jpg'
import Win4Credits from '../images/bonuses/Win4Credits.jpg'
import WinInfluence from '../images/bonuses/WinInfluence.jpg'

export class BonusTokenDescription extends TokenDescription {
  help = BonusTokenHelp
  height = 1.5
  width = 2.3
  borderRadius = 0.8
  menuAlwaysVisible = true
  images = {
    [Bonus.Exile2OpponentCards]: Exile2OpponentCards,
    [Bonus.Mobilize2]: Mobilize2,
    [Bonus.TakeLeaderBadge]: TakeLeaderBadge,
    [Bonus.Transfer]: Transfer,
    [Bonus.Win1Zenithium]: Win1Zenithium,
    [Bonus.Win3Credits]: Win3Credit,
    [Bonus.Win4Credits]: Win4Credits,
    [Bonus.WinInfluence]: WinInfluence
  }

  backImage = BonusBack

  getItemMenu(_item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const move = legalMoves.find(m => isMoveItemType(MaterialType.BonusToken)(m) && m.itemIndex === context.index)
    if (move) {
      return (
        <ItemMenuButton move={move} y={-2} x={0} label={<Trans i18nKey="help.action.take-bonus" />}>
          <FontAwesomeIcon icon={faHandBackFist} />
        </ItemMenuButton>
      )
    }
  }
}

export const bonusTokenDescription = new BonusTokenDescription()
