/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useGame, useLegalMove, useLegalMoves, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { DevelopTechnologyRule } from '@gamepark/zenith/rules/effect'
import { getTeamColor } from '@gamepark/zenith/TeamColor'
import { Trans, useTranslation } from 'react-i18next'
import { getFactionForHeader, HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const DevelopTechnologyHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new DevelopTechnologyRule(game)
  const doThem: MoveItem[] = useLegalMoves<MoveItem>((move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move))
  const effect = rules.effect
  const faction = effect.faction!
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const { t } = useTranslation()
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)

  const source = <EffectSource effectSource={effect.effectSource} />
  const components = {
    ...HeaderTransComponents,
    source,
    faction: getFactionForHeader(faction)
  }

  if (itsMe) {
    if (!effect.faction) {
      return (
        <Trans
          defaults="header.develop.choice"
          components={{
            ...components,
            developAnimod: <PlayMoveButton move={findMoveFor(rules, doThem, Faction.Animod)} />,
            developHumanoid: <PlayMoveButton move={findMoveFor(rules, doThem, Faction.Human)} />,
            developRobot: <PlayMoveButton move={findMoveFor(rules, doThem, Faction.Robot)} />,
            pass: <PlayMoveButton move={pass} />
          }}
        />
      )
    }

    const doIt = doThem[0]
    return <Trans defaults="header.develop" components={{ ...components, develop: <PlayMoveButton move={doIt} />, pass: <PlayMoveButton move={pass} /> }} />
  }

  return <Trans defaults="header.develop" values={{ player: name, team: t(`team.${getTeamColor(activePlayer)}`) }} components={components} />
}

const findMoveFor = (rules: DevelopTechnologyRule, moves: MoveItem[], faction: Faction) => {
  return moves.find((m) => {
    const marker = rules.material(MaterialType.TechMarker).getItem(m.itemIndex)
    const board = rules.material(MaterialType.TechnologyBoard).getItem(marker.location.parent!)
    return board.location.id === faction
  })
}
