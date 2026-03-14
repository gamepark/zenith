import { LocationDescription, Locator } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'

class AgentCardCostLocator extends Locator {
  parentItemType = MaterialType.AgentCard
  locationDescription = new LocationDescription({ height: 1.35, width: 1.35, borderRadius: 0.675 })
  positionOnParent = { x: 13, y: 9 }
}

export const agentCardCostLocator = new AgentCardCostLocator()
