/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemContext, ItemMenuButton, TokenDescription } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { Trans } from 'react-i18next'
import Mercury from '../images/planet/Mercury.png'
import Venus from '../images/planet/Venus.png'
import Terra from '../images/planet/Terra.png'
import Mars from '../images/planet/Mars.png'
import Jupiter from '../images/planet/Jupiter.png'
import { InfluenceDiscHelp } from './InfluenceDiscHelp'
import { imWhiteTeam } from '../locators/position.utils'
import { planetBoardDescription } from './PlanetBoardDescription'

function getYPercent(x: number): number {
  const factor = x === 0 ? 0 : (x < 0 ? -1 : 1)
  return 50 + factor * 5.3 + 10.5 * x
}

function getYDeltaEm(fromX: number, toX: number, isWhite: boolean): number {
  const deltaPercent = getYPercent(toX) - getYPercent(fromX)
  const deltaEm = (deltaPercent / 100) * planetBoardDescription.height
  return isWhite ? deltaEm : -deltaEm
}

export class InfluenceDiscDescription extends TokenDescription {
  help = InfluenceDiscHelp
  height = 2.35
  width = 2.6
  menuAlwaysVisible = true
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

  getItemMenu(item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const allMoves = legalMoves.filter(
      (m): m is MoveItem => isMoveItemType(MaterialType.InfluenceDisc)(m) && m.itemIndex === context.index
    )
    if (!allMoves.length) return

    const team = context.player !== undefined ? getTeamColor(context.player as PlayerId) : undefined

    const isGaining = (move: MoveItem) => {
      if (team === undefined) return true
      // White captures at +4 (x increases), Black captures at -4 (x decreases)
      return (team === TeamColor.White && move.location.x! > item.location.x!)
        || (team === TeamColor.Black && move.location.x! < item.location.x!)
    }

    // Deduplicate: keep one move per distinct destination
    const gainingMoves = allMoves.filter(m => isGaining(m))
    const givingMoves = allMoves.filter(m => !isGaining(m))
    const moves: MoveItem[] = []
    const seenPositions = new Set<number>()
    for (const m of gainingMoves) {
      if (!seenPositions.has(m.location.x!)) {
        seenPositions.add(m.location.x!)
        moves.push(m)
      }
    }
    for (const m of givingMoves) {
      if (!seenPositions.has(m.location.x!)) {
        seenPositions.add(m.location.x!)
        moves.push(m)
      }
    }

    // Sort gaining by distance asc, giving by distance asc
    const sortedGaining = moves.filter(m => isGaining(m)).sort((a, b) => Math.abs(a.location.x! - item.location.x!) - Math.abs(b.location.x! - item.location.x!))
    const sortedGiving = moves.filter(m => !isGaining(m)).sort((a, b) => Math.abs(a.location.x! - item.location.x!) - Math.abs(b.location.x! - item.location.x!))

    const isWhite = imWhiteTeam(context)
    const allSorted = [
      ...sortedGaining.map(m => ({ move: m, gaining: true })),
      ...sortedGiving.map(m => ({ move: m, gaining: false }))
    ]

    return (
      <>
        {allSorted.map(({ move, gaining }, i) => {
          const deltaY = getYDeltaEm(item.location.x!, move.location.x!, isWhite)
          const quantity = Math.abs(move.location.x! - item.location.x!)
          return (
            <ItemMenuButton key={i} move={move} x={0} y={deltaY}
              label={<Trans i18nKey="help.action.influence" />}>
              <FontAwesomeIcon icon={gaining ? faArrowDown : faArrowUp} />
            </ItemMenuButton>
          )
        })}
      </>
    )
  }
}

export const influenceDiscDescription = new InfluenceDiscDescription()
