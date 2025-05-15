import { MaterialDescription } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { agentCardDescription } from './AgentCardDescription'
import { diplomacyBoardDescription } from './DiplomacyBoardDescription'
import { leaderBadgeDescription } from './LeaderBadgeDescription'
import { planetBoardDescription } from './PlanetBoardDescription'
import { influenceDiscDescription } from './InfluenceDiscDescription'
import { techMarkerDescription } from './TechMarkerDescription'
import { technologyBoardDescription } from './TechnologyBoardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.PlanetBoard]: planetBoardDescription,
  [MaterialType.DiplomacyBoard]: diplomacyBoardDescription,
  [MaterialType.TechnologyBoard]: technologyBoardDescription,
  [MaterialType.AgentCard]: agentCardDescription,
  [MaterialType.InfluenceDisc]: influenceDiscDescription,
  [MaterialType.LeaderBadgeToken]: leaderBadgeDescription,
  [MaterialType.TechMarker]: techMarkerDescription
}
