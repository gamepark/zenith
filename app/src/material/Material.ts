import { MaterialDescription } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { agentCardDescription } from './AgentCardDescription'
import { bonusTokenDescription } from './BonusTokenDescription'
import { creditTokenDescription } from './CreditTokendescription'
import { diplomacyBoardDescription } from './DiplomacyBoardDescription'
import { influenceDiscDescription } from './InfluenceDiscDescription'
import { leaderBadgeDescription } from './LeaderBadgeDescription'
import { planetBoardDescription } from './PlanetBoardDescription'
import { techMarkerDescription } from './TechMarkerDescription'
import { technologyBoardDescription } from './TechnologyBoardDescription'
import { zenithiumTokenDescription } from './ZenithiumTokenDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.PlanetBoard]: planetBoardDescription,
  [MaterialType.DiplomacyBoard]: diplomacyBoardDescription,
  [MaterialType.TechnologyBoard]: technologyBoardDescription,
  [MaterialType.AgentCard]: agentCardDescription,
  [MaterialType.InfluenceDisc]: influenceDiscDescription,
  [MaterialType.LeaderBadgeToken]: leaderBadgeDescription,
  [MaterialType.TechMarker]: techMarkerDescription,
  [MaterialType.CreditToken]: creditTokenDescription,
  [MaterialType.ZenithiumToken]: zenithiumTokenDescription,
  [MaterialType.BonusToken]: bonusTokenDescription
}
