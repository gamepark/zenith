/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationDescription, Locator } from '@gamepark/react-game'
import { Location, XYCoordinates } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { LocationType } from '@gamepark/zenith/material/LocationType'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'

const barHeight: Record<number, number> = {
  0: 2.55,
  1: 5.2,
  2: 9.45,
  3: 12.5,
  4: 15.7,
  5: 18.8
}

export class TechLevelBarLocator extends Locator {
  parentItemType = MaterialType.TechnologyBoard

  getPositionOnParent(location: Location): XYCoordinates {
    const isWhite = location.player === TeamColor.White
    let whiteOffset: number
    let blackOffset: number
    switch (location.id as Faction) {
      case Faction.Human:
        whiteOffset = 2.5
        blackOffset = 2.5
        break
      case Faction.Animod:
        whiteOffset = 2
        blackOffset = 2.5
        break
      case Faction.Robot:
        whiteOffset = 2
        blackOffset = 2
        break
      default:
        whiteOffset = 2
        blackOffset = 2
        break
    }
    return { x: isWhite ? whiteOffset : 100 - blackOffset, y: 50 }
  }

  locationDescription = new TechLevelBarDescription()
}

const TechLevelBarContent = ({ location }: { location: Location }) => {
  const rules = useRules<MaterialRules>()!
  const markers = rules
    .material(MaterialType.TechMarker)
    .location(LocationType.TechnologyBoardTokenSpace)
    .player(location.player!)
    .filter((item) => item.location.parent === location.parent)
  const level = markers.length === 0 ? 0 : (markers.getItem()!.location.x ?? 0)
  const heightEm = barHeight[level] ?? 0
  if (heightEm <= 0) return null

  const isWhite = location.player === TeamColor.White
  const color = isWhite ? 'rgba(180,175,185,0.95)' : 'rgba(40,40,48,0.98)'

  return (
    <div css={css`
      position: absolute;
      bottom: 0;
      ${isWhite ? 'left: 50%' : 'right: 50%'};
      height: ${heightEm}em;
      transition: height 0.2s ease-in-out;
      pointer-events: none;
    `}>
      {/* Vertical stem */}
      <div css={css`
        position: absolute;
        bottom: 0;
        ${isWhite ? 'left: 0' : 'right: 0'};
        width: 0;
        height: 100%;
        ${isWhite ? `border-left: 0.25em solid ${color}` : `border-right: 0.25em solid ${color}`};
      `} />
      {/* Chevron arrow */}
      <div css={css`
        position: absolute;
        top: -0.35em;
        ${isWhite ? 'left: 0' : 'right: 0'};
        width: 0;
        height: 0;
        ${isWhite
          ? `border-left: 0.6em solid ${color}; border-top: 0.35em solid transparent; border-bottom: 0.35em solid transparent;`
          : `border-right: 0.6em solid ${color}; border-top: 0.35em solid transparent; border-bottom: 0.35em solid transparent;`
        }
      `} />
    </div>
  )
}

class TechLevelBarDescription extends LocationDescription {
  width = 0.3
  height = 20.5
  borderRadius = 0
  content = TechLevelBarContent

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

export const techLevelBarLocator = new TechLevelBarLocator()
