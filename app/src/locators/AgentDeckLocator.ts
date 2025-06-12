import { DeckLocator } from '@gamepark/react-game'

export class AgentDeckLocator extends DeckLocator {
  coordinates = { x: -45, y: -6 }
}

export const agentDeckLocator = new AgentDeckLocator()
