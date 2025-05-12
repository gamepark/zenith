import { Locator } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { agentDeckLocator } from './AgentDeckLocator'
import { diplomacyBoardPlaceLocator } from './DiplomacyBoardPlaceLocator'
import { planetBoardInfluenceDiscSpace } from './PlanetBoardInfluenceDiscSpace'
import { playerHandLocator } from './PlayerHandLocator'
import { technologyBoardPlaceLocator } from './TechnologyBoardPlaceLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.DiplomacyBoardPlace]: diplomacyBoardPlaceLocator,
  [LocationType.TechnologyBoardPlace]: technologyBoardPlaceLocator,
  [LocationType.PlayerHand]: playerHandLocator,
  [LocationType.AgentDeck]: agentDeckLocator,
  [LocationType.PlanetBoardInfluenceDiscSpace]: planetBoardInfluenceDiscSpace
}
