/** @jsxImportSource @emotion/react */
import { usePlayerId, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { EndGameHelper } from '@gamepark/zenith'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { Trans } from 'react-i18next'

export const ZenithResultHeader = () => {
  const rules = useRules<MaterialRules>()
  const player = usePlayerId<PlayerId>()
  if (!rules) return null
  const helper = new EndGameHelper(rules.game)
  const winningTeam = helper.winningTeam
  if (!winningTeam) return null

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
  const defaults: Record<string, string> = {
    'result.victory.absolute': 'Congratulations, you win an absolute victory!',
    'result.victory.democratic': 'Congratulations, you win a democratic victory!',
    'result.victory.popular': 'Congratulations, you win a popular victory!',
    'result.defeat.absolute': 'You lose... The opposing team wins an absolute victory.',
    'result.defeat.democratic': 'You lose... The opposing team wins a democratic victory.',
    'result.defeat.popular': 'You lose... The opposing team wins a popular victory.'
  }

  return <Trans defaults={defaults[key]} i18nKey={key} />
}
