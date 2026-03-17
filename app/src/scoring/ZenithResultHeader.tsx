/** @jsxImportSource @emotion/react */
import { usePlayerId, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { EndGameHelper } from '@gamepark/zenith'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { Trans, useTranslation } from 'react-i18next'

export const ZenithResultHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<MaterialRules>()
  const player = usePlayerId<PlayerId>()
  if (!rules) return null
  const helper = new EndGameHelper(rules.game)
  const winningTeam = helper.winningTeam
  if (!winningTeam) return null

  const planets = helper.getTeamPlanet(winningTeam)
  let victoryType: string
  if (planets.length >= 5) {
    victoryType = 'popular'
  } else if (helper.getCountDifferentInfluence(planets) >= 4) {
    victoryType = 'democratic'
  } else {
    victoryType = 'absolute'
  }

  const victory = t(`victory.${victoryType}`)
  const isWinner = player !== undefined && new PlayerHelper(rules.game, player).team === winningTeam
  if (isWinner) {
    return <Trans defaults="You win a {victory} victory!" i18nKey="result.victory" values={{ victory }} />
  }

  const team = t(`team.${winningTeam}`)
  return <Trans defaults="The {team} team wins a {victory} victory!" i18nKey="result.defeat" values={{ team, victory }} />
}
