import { LocationDescription, Locator } from '@gamepark/react-game'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'

class AgentCardFactionLocator extends Locator {
  parentItemType = MaterialType.AgentCard
  locationDescription = new LocationDescription({ height: 1.35, width: 1.35, borderRadius: 0.675 })
  positionOnParent = { x: 84.5, y: 10 }
}

export const agentCardFactionLocator = new AgentCardFactionLocator()
