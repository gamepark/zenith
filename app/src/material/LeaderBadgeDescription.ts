import { TokenDescription } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import LeaderGold from '../images/leader/LeaderGold.png'
import LeaderSilver from '../images/leader/LeaderSilver.png'

export class LeaderBadgeDescription extends TokenDescription {
  width = 5.8
  height = 4.06
  borderRadius = 1.5
  image = LeaderSilver
  backImage = LeaderGold

  isFlipped(item: Partial<MaterialItem>) {
    return !!item.location?.rotation
  }
}

export const leaderBadgeDescription = new LeaderBadgeDescription()
