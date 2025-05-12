import { DeckLocator } from '@gamepark/react-game'

export class AgentDiscardLocator extends DeckLocator {
  coordinates = { x: -45, y: 5 }
}

export const agentDiscardLocator = new AgentDiscardLocator()
