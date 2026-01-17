import { TokenDescription } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
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
}

export const leaderBadgeDescription = new LeaderBadgeDescription()
