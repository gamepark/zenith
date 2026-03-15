/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DeckLocator, LocationDescription, useRules } from '@gamepark/react-game'
import { Location, MaterialRules } from '@gamepark/rules-api'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'

export class AgentDeckLocator extends DeckLocator {
  limit = 20
  coordinates = { x: -48, y: -5 }
  navigationSorts = []
  location = { type: LocationType.AgentDeck }
  locationDescription = new AgentDeckDescription()
}

const DeckCounter = ({ location: _location }: { location: Location }) => {
  const rules = useRules<MaterialRules>()!
  const count = rules.material(MaterialType.AgentCard).location(LocationType.AgentDeck).length
  if (count === 0) return null
  return (
    <div css={counterCss}>
      <span css={countNumberCss}>{count}</span>
    </div>
  )
}

const counterCss = css`
  position: absolute;
  bottom: 0.4em;
  left: 50%;
  transform: translateX(-50%) translateZ(10em);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  white-space: nowrap;
`

const countNumberCss = css`
  font-size: 1.4em;
  font-weight: 700;
  color: #f5efe4;
  background: rgba(0, 0, 0, 0.6);
  border: 0.08em solid rgba(245, 239, 228, 0.3);
  border-radius: 1em;
  padding: 0.05em 0.5em;
  min-width: 2em;
  text-align: center;
  text-shadow: 0 0.05em 0.15em rgba(0, 0, 0, 0.5);
  box-shadow: 0 0.15em 0.5em rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
`

class AgentDeckDescription extends LocationDescription {
  width = 5.8
  height = 8.9
  borderRadius = 0.5
  content = DeckCounter

  getExtraCss() {
    return css`
      overflow: visible;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      pointer-events: none;
    `
  }
}

export const agentDeckLocator = new AgentDeckLocator()
