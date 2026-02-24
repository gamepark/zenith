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

    // Deduplicate: keep one gaining move (farthest) and one giving move (farthest)
    const gainingMoves = allMoves.filter(m => isGaining(m))
    const givingMoves = allMoves.filter(m => !isGaining(m))
    const moves: MoveItem[] = []
    if (gainingMoves.length > 0) {
      moves.push(gainingMoves.reduce((best, m) => Math.abs(m.location.x!) > Math.abs(best.location.x!) ? m : best))
    }
    if (givingMoves.length > 0) {
      moves.push(givingMoves.reduce((best, m) => Math.abs(m.location.x!) > Math.abs(best.location.x!) ? m : best))
    }

    if (moves.length === 1) {
      const gaining = isGaining(moves[0])
      return (
        <ItemMenuButton move={moves[0]} angle={gaining ? 180 : 0} radius={3}
          label={<Trans i18nKey="help.action.influence" />}>
          <FontAwesomeIcon icon={gaining ? faArrowDown : faArrowUp} />
        </ItemMenuButton>
      )
    }

    return (
      <>
        {moves.map((move, i) => {
          const gaining = isGaining(move)
          return (
            <ItemMenuButton key={i} move={move} angle={i === 0 ? -30 : 30} radius={3}
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
