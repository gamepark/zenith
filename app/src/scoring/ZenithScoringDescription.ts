import { ScoringDescription } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { EndGameHelper } from '@gamepark/zenith'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import i18next from 'i18next'

export class ZenithScoringDescription implements ScoringDescription<PlayerId, MaterialRules> {
  getScoringKeys() {
    return []
  }

  getScoringHeader() {
    return ''
  }

  getScoringPlayerData() {
    return null
  }

  getResultText(rules: MaterialRules, player: PlayerId | undefined) {
    const helper = new EndGameHelper(rules.game)
    const winningTeam = helper.winningTeam
    if (!winningTeam) return undefined

    const planets = helper.getTeamPlanet(winningTeam)
    let victoryType: string
    if (planets.length >= 5) {
      victoryType = 'absolute'
    } else if (helper.getCountDifferentInfluence(planets) >= 4) {
      victoryType = 'democratic'
    } else {
      victoryType = 'popular'
    }

    const isWinner = player !== undefined && getTeamColor(player) === winningTeam
    const key = isWinner ? `result.victory.${victoryType}` : `result.defeat.${victoryType}`
    return i18next.t(key)
  }
}
