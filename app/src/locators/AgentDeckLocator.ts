import { DeckLocator } from '@gamepark/react-game'

export class AgentDeckLocator extends DeckLocator {
  limit = 20
  coordinates = { x: -45, y: -5 }
}

export const agentDeckLocator = new AgentDeckLocator()
