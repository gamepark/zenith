import { css } from '@emotion/react'
import { TokenDescription } from '@gamepark/react-game'
import { Influence } from '@gamepark/zenith/material/Influence'
import Mercury from '../images/planet/Mercury.png'
import Venus from '../images/planet/Venus.png'
import Terra from '../images/planet/Terra.png'
import Mars from '../images/planet/Mars.png'
import Jupiter from '../images/planet/Jupiter.png'
import { InfluenceDiscHelp } from './InfluenceDiscHelp'

export class InfluenceDiscDescription extends TokenDescription {
  help = InfluenceDiscHelp
  height = 2.35
  width = 2.6
  images = {
    [Influence.Mercury]: Mercury,
    [Influence.Venus]: Venus,
    [Influence.Terra]: Terra,
    [Influence.Mars]: Mars,
    [Influence.Jupiter]: Jupiter
  }

  transparency = true

  getFrontExtraCss() {
    return css`
      border-radius: 1.3em / 1.1em;
    `
  }
}

export const influenceDiscDescription = new InfluenceDiscDescription()
