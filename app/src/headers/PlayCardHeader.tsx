/** @jsxImportSource @emotion/react */
import { Animation, linkButtonCss, PlayMoveButton, useAnimation, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialMoveBuilder, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { Trans, useTranslation } from 'react-i18next'
import { HeaderTransComponents } from '../i18n/trans.components'
import { LocationType } from '@gamepark/zenith/material/LocationType'
const displayMaterial = MaterialMoveBuilder.displayMaterialHelp

export const PlayCardHeader = () => {
  const rules = useRules<ZenithRules>()!
  const { t } = useTranslation()
  const me = usePlayerId<PlayerId>()
  const activePlayer = rules.getActivePlayer()
  const itsMe = me === activePlayer
  const name = usePlayerName(activePlayer)
  const recruit = useAnimation((a: Animation<MoveItem>) => isMoveItemType(MaterialType.AgentCard)(a.move) && a.move.location.type === LocationType.Influence)
  const id = recruit?.move.reveal?.id

  if (itsMe) {
    return <Trans i18nKey="header.play" />
  }

  if (recruit) {
    return (
      <Trans
        i18nKey="header.recruit.player"
        values={{ player: name }}
        components={{
          ...HeaderTransComponents,
          agent: (
            <PlayMoveButton move={displayMaterial(MaterialType.AgentCard, { id: id })} css={linkButtonCss}>
              {t(`agent.${id}`)}
            </PlayMoveButton>
          )
        }}
      />
    )
  }

  return <Trans i18nKey="header.play.player" values={{ player: name }} components={HeaderTransComponents} />
}
