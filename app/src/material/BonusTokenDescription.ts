import { TokenDescription } from '@gamepark/react-game'
import { Bonus } from '@gamepark/zenith/material/Bonus'
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
  height = 1.5
  width = 2.3
  borderRadius = 0.8
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
}

export const bonusTokenDescription = new BonusTokenDescription()
