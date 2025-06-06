import { DeckLocator, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'

export class AgentDiscardLocator extends DeckLocator {
  coordinates = { x: -45, y: 5 }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', `translateX(25%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }
}

export const agentDiscardLocator = new AgentDiscardLocator()
