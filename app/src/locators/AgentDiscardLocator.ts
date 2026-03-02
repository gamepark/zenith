import { DeckLocator, DropAreaDescription, ItemContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { agentCardDescription } from '../material/AgentCardDescription'

export class AgentDiscardLocator extends DeckLocator {
  coordinates = { x: -45, y: 5 }
  locationDescription = new DropAreaDescription(agentCardDescription)

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', `translateX(25%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }
}

export const agentDiscardLocator = new AgentDiscardLocator()
