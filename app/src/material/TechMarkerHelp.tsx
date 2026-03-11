/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { TeamColor } from '@gamepark/zenith/TeamColor'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { actionButtonCss, actionSectionCss, CollapsibleDetails } from './HelpActionButton'

export const TechMarkerHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const teamColor = item.id as TeamColor
  const moves = useLegalMoves<MoveItem>((move: MaterialMove) => isMoveItemType(MaterialType.TechMarker)(move) && move.itemIndex === itemIndex)

  const content = (
    <div css={containerCss}>
      <div css={headerCss}>
        <span css={titleCss}>{t('help.tech-marker.title')}</span>
        <span css={teamNameCss}>{t(`team.${teamColor}`)}</span>
      </div>

      <div css={descCss}>{t('help.tech-marker.desc')}</div>

      <div css={infoCss}>
        <span css={infoLabelCss}>{t('help.tech-marker.position')}</span>
        <span css={infoTextCss}>{t('help.tech-marker.position.desc')}</span>
      </div>
    </div>
  )

  if (moves.length > 0) {
    return (
      <CollapsibleDetails actions={
        <div css={actionSectionCss}>
          <PlayMoveButton move={moves[0]} onPlay={closeDialog} css={actionButtonCss}>
            {t('help.action.develop')}
          </PlayMoveButton>
        </div>
      }>
        {content}
      </CollapsibleDetails>
    )
  }

  return content
}

const containerCss = css`
  min-width: 15em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`

const headerCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const titleCss = css`
  font-size: 1.1em;
  font-weight: 700;
  color: #3e3020;
`

const teamNameCss = css`
  font-size: 0.9em;
  color: rgba(62, 48, 32, 0.5);
  text-transform: capitalize;
`

const descCss = css`
  font-size: 0.95em;
  color: #3e3020;
  line-height: 1.4;
`

const infoCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.2em;
`

const infoLabelCss = css`
  font-size: 0.85em;
  font-weight: 600;
  color: rgba(62, 48, 32, 0.5);
  text-transform: uppercase;
`

const infoTextCss = css`
  font-size: 0.95em;
  color: #3e3020;
`
