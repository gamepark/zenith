import { TokenDescription } from '@gamepark/react-game'
import { Influence } from '@gamepark/zenith/material/Influence'
import Mercury from '../images/planet/Mercury.png'
import Venus from '../images/planet/Venus.png'
import Terra from '../images/planet/Terra.png'
import Mars from '../images/planet/Mars.png'
import Jupiter from '../images/planet/Jupiter.png'

export class InfluenceDiscDescription extends TokenDescription {
  height = 2.5
  width = 2.7
  images = {
    [Influence.Mercury]: Mercury,
    [Influence.Venus]: Venus,
    [Influence.Terra]: Terra,
    [Influence.Mars]: Mars,
    [Influence.Jupiter]: Jupiter
  }
}

export const influenceDiscDescription = new InfluenceDiscDescription()
