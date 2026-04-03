/** @jsxImportSource @emotion/react */
import { PlayMoveButton, useGame, useLegalMove, useLegalMoves, usePlayerId, usePlayerName } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { DevelopTechnologyEffect, ExpandedEffect } from '@gamepark/zenith/material/effect/Effect'
import { EffectType } from '@gamepark/zenith/material/effect/EffectType'
import { Faction } from '@gamepark/zenith/material/Faction'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { DevelopTechnologyRule } from '@gamepark/zenith/rules/effect'
import { PlayerHelper } from '@gamepark/zenith/rules/helper/PlayerHelper'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { getFactionForHeader, HeaderTransComponents } from '../i18n/trans.components'
import { EffectSource } from './EffectSource'

export const DevelopTechnologyHeader = () => {
  const game = useGame<MaterialGame>()!
  const rules = new DevelopTechnologyRule(game)
  const doThem: MoveItem[] = useLegalMoves<MoveItem>((move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move))
  const effect = rules.effect
  const pass = useLegalMove((move: MaterialMove) => isCustomMoveType(CustomMoveType.Pass)(move))
  const { t } = useTranslation()
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)

  // Cache the last valid effect so the header stays stable during animation
  const [cachedEffect, setCachedEffect] = useState<ExpandedEffect<DevelopTechnologyEffect> | undefined>(undefined)
  const isValidEffect = effect && (effect as any).type === EffectType.DevelopTechnology
  if (isValidEffect && effect !== cachedEffect) setCachedEffect(effect)
  const displayEffect = isValidEffect ? effect : cachedEffect

  const animating = !isValidEffect && !!displayEffect

  const source = displayEffect ? <EffectSource effectSource={displayEffect.effectSource} /> : <span />
  const components = {
    ...HeaderTransComponents,
    source,
    faction: displayEffect?.faction ? getFactionForHeader(displayEffect.faction) : <span />
  }

  if (!displayEffect) return null

  if (itsMe) {
    if (!displayEffect.faction) {
      return (
        <Trans
          i18nKey="header.develop.choice"
          components={{
            ...components,
            developAnimod: <PlayMoveButton move={animating ? undefined : findMoveFor(rules, doThem, Faction.Animod)} />,
            developHumanoid: <PlayMoveButton move={animating ? undefined : findMoveFor(rules, doThem, Faction.Human)} />,
            developRobot: <PlayMoveButton move={animating ? undefined : findMoveFor(rules, doThem, Faction.Robot)} />,
            pass: <PlayMoveButton move={animating ? undefined : pass} />
          }}
        />
      )
    }

    const doIt = animating ? undefined : doThem[0]
    return <Trans i18nKey="header.develop" components={{ ...components, develop: <PlayMoveButton move={doIt} />, pass: <PlayMoveButton move={animating ? undefined : pass} /> }} />
  }

  return <Trans i18nKey="header.develop.player" values={{ player: name, team: t(`team.${new PlayerHelper(game, activePlayer!).team}`) }} components={components} />
}

const findMoveFor = (rules: DevelopTechnologyRule, moves: MoveItem[], faction: Faction) => {
  return moves.find((m) => {
    const marker = rules.material(MaterialType.TechMarker).getItem(m.itemIndex)
    const board = rules.material(MaterialType.TechnologyBoard).getItem(marker.location.parent!)
    return board.location.id === faction
  })
}
