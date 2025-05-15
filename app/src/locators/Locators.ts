import { Locator } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { agentDeckLocator } from './AgentDeckLocator'
import { agentDiscardLocator } from './AgentDiscardLocator'
import { diplomacyBoardLeaderBadgeSpaceLocator } from './DiplomacyBoardLeaderBadgeSpaceLocator'
import { diplomacyBoardPlaceLocator } from './DiplomacyBoardPlaceLocator'
import { planetBoardInfluenceDiscSpaceLocator } from './PlanetBoardInfluenceDiscSpaceLocator'
import { playerHandLocator } from './PlayerHandLocator'
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
  [LocationType.TechnologyBoardTokenSpace]: technologyBoardTechMarkerSpaceLocator
}
