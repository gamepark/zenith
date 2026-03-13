import { css, Interpolation, Theme } from '@emotion/react'
import { DropAreaDescription, LocationContext, MaterialContext, ComponentSize } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { Influence } from '@gamepark/zenith/material/Influence'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { InfluenceColumnContent } from './InfluenceColumnContent'

const PLANET_BG: Record<Influence, string> = {
  [Influence.Mercury]: 'rgba(139,123,181,0.25)',
  [Influence.Venus]: 'rgba(232,148,58,0.25)',
  [Influence.Terra]: 'rgba(79,180,216,0.2)',
  [Influence.Mars]: 'rgba(200,56,74,0.25)',
  [Influence.Jupiter]: 'rgba(91,168,158,0.25)'
}

const PLANET_BORDER: Record<Influence, string> = {
  [Influence.Mercury]: 'rgba(139,123,181,0.35)',
  [Influence.Venus]: 'rgba(232,148,58,0.35)',
  [Influence.Terra]: 'rgba(79,180,216,0.3)',
  [Influence.Mars]: 'rgba(200,56,74,0.35)',
  [Influence.Jupiter]: 'rgba(91,168,158,0.35)'
}

export class InfluenceColumnDescription extends DropAreaDescription {
  content = InfluenceColumnContent

  constructor() {
    super({ width: 5.8, height: 16.1, borderRadius: 0.5 })
  }

  getLocationSize(location: Location, context: MaterialContext): ComponentSize {
    const me: PlayerId = (context.player ?? context.rules?.players[0]) as PlayerId
    const team = location.player as TeamColor
    const isMyTeam = me ? getTeamColor(me) === team : false
    return { width: 5.8, height: isMyTeam ? 16.1 : 13.2 }
  }

  getExtraCss(location: Location, context: LocationContext): Interpolation<Theme> {
    const me: PlayerId = (context.player ?? context.rules?.players[0]) as PlayerId
    if (!me) return
    const planet = location.id as Influence
    if (!planet) return
    const bg = PLANET_BG[planet]
    const border = PLANET_BORDER[planet]

    return css`
      pointer-events: none;
      background: ${bg};
      border: 1.5px solid ${border};
      border-radius: 0.5em;
    `
  }
}
