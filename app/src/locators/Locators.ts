import { Locator } from '@gamepark/react-game'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { agentDeckLocator } from './AgentDeckLocator'
import { agentDiscardLocator } from './AgentDiscardLocator'
import { bonusDiscardLocator } from './BonusDiscardLocator'
import { bonusStockLocator } from './BonusStockLocator'
import { creditStockLocator } from './CreditStockLocator'
import { diplomacyBoardLeaderBadgeSpaceLocator } from './DiplomacyBoardLeaderBadgeSpaceLocator'
import { diplomacyBoardPlaceLocator } from './DiplomacyBoardPlaceLocator'
import { influenceDiscStockLocator } from './InfluenceDiscStockLocator'
import { influenceLocator } from './InfluenceLocator'
import { planetBoardBonusSpaceLocator } from './PlanetBoardBonusSpaceLocator'
import { planetBoardInfluenceDiscSpaceLocator } from './PlanetBoardInfluenceDiscSpaceLocator'
import { planetBoardPlaceLocator } from './PlanetBoardPlaceLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { teamCreditLocator } from './TeamCreditLocator'
import { teamLeaderBadgeLocator } from './TeamLeaderBadgeLocator'
import { teamPlanetLocator } from './TeamPlanetLocator'
import { teamZenithiumLocator } from './TeamZenithiumLocator'
import { technologyBoardBonusSpaceLocator } from './TechnologyBoardBonusSpaceLocator'
import { technologyBoardPlaceLocator } from './TechnologyBoardPlaceLocator'
import { technologyBoardTechMarkerSpaceLocator } from './TechnologyBoardTechMarkerSpaceLocator'
import { zenithiumStockLocator } from './ZenithiumStockLocator'

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
  [LocationType.TeamLeaderBadge]: teamLeaderBadgeLocator,
  [LocationType.InfluenceDiscStock]: influenceDiscStockLocator,
  [LocationType.ZenithiumStock]: zenithiumStockLocator,
  [LocationType.CreditStock]: creditStockLocator,
  [LocationType.PlanetBoardBonusSpace]: planetBoardBonusSpaceLocator,
  [LocationType.TechnologyBoardBonusSpace]: technologyBoardBonusSpaceLocator,
  [LocationType.BonusTokenStock]: bonusStockLocator,
  [LocationType.BonusDiscard]: bonusDiscardLocator
}
