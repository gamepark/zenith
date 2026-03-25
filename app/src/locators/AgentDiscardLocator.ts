import { DeckLocator, DropAreaDescription, isItemContext, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { agentCardDescription } from '../material/AgentCardDescription.tsx'
import { DiscardHelp } from './DiscardHelp'

class AgentDiscardDescription extends DropAreaDescription {
  help = DiscardHelp
  constructor() {
    super(agentCardDescription)
  }
}

export class AgentDiscardLocator extends DeckLocator {
  coordinates = { x: -48, y: 5 }

  getLocationDescription(location: Location, context: MaterialContext) {
    if (isItemContext(context)) {
      return super.getLocationDescription(location, context)
    }
    const { width = 0, height = 0 } = agentCardDescription.getSize(undefined)
    const { x = 0, y = 0 } = this.getCurrentMaxGap(location, context)
    const description = new AgentDiscardDescription()
    description.width = width + Math.abs(x)
    description.height = height + Math.abs(y)
    description.borderRadius = agentCardDescription.borderRadius
    return description
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', `translateX(25%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }
}

export const agentDiscardLocator = new AgentDiscardLocator()
