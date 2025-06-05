import { Locator } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { agentDeckLocator } from './AgentDeckLocator'
import { agentDiscardLocator } from './AgentDiscardLocator'
import { diplomacyBoardLeaderBadgeSpaceLocator } from './DiplomacyBoardLeaderBadgeSpaceLocator'
import { diplomacyBoardPlaceLocator } from './DiplomacyBoardPlaceLocator'
import { influenceLocator } from './InfluenceLocator'
import { planetBoardInfluenceDiscSpaceLocator } from './PlanetBoardInfluenceDiscSpaceLocator'
import { planetBoardPlaceLocator } from './PlanetBoardPlaceLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { teamCreditLocator } from './TeamCreditLocator'
import { teamLeaderBadgeLocator } from './TeamLeaderBadgeLocator'
import { teamPlanetLocator } from './TeamPlanetLocator'
import { teamZenithiumLocator } from './TeamZenithiumLocator'
import { technologyBoardPlaceLocator } from './TechnologyBoardPlaceLocator'
import { technologyBoardTechMarkerSpaceLocator } from './TechnologyBoardTechMarkerSpaceLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.DiplomacyBoardPlace]: diplomacyBoardPlaceLocator,
  [LocationType.TechnologyBoardPlace]: technologyBoardPlaceLocator,
  [LocationType.PlayerHand]: playerHandLocator,
  [LocationType.AgentDeck]: agentDeckLocator,
  [LocationType.AgentDiscard]: agentDiscardLocator,
  [LocationType.PlanetBoardInfluenceDiscSpace]: planetBoardInfluenceDiscSpaceLocator,
  [LocationType.DiplomacyBoardLeaderBadgeSpace]: diplomacyBoardLeaderBadgeSpaceLocator,
  [LocationType.TechnologyBoardTokenSpace]: technologyBoardTechMarkerSpaceLocator,
  [LocationType.PlanetBoardPlace]: planetBoardPlaceLocator,
  [LocationType.Influence]: influenceLocator,
  [LocationType.TeamCredit]: teamCreditLocator,
  [LocationType.TeamZenithium]: teamZenithiumLocator,
  [LocationType.TeamPlanets]: teamPlanetLocator,
  [LocationType.TeamLeaderBadge]: teamLeaderBadgeLocator
}
