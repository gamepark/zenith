/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { Bonus } from '@gamepark/zenith/material/Bonus'
import { Bonuses } from '@gamepark/zenith/material/Bonuses'
import { MaterialType } from '@gamepark/zenith/material/MaterialType'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { EffectText } from '../components/EffectText'
import { actionButtonCss, actionSectionCss } from './HelpActionButton'

export const BonusTokenHelp: FC<MaterialHelpProps<PlayerId, MaterialType>> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const bonusId = item.id as Bonus
  const bonusEffect = Bonuses[bonusId]?.effect
  const moves = useLegalMoves<MoveItem>((move: MaterialMove) => isMoveItemType(MaterialType.BonusToken)(move) && move.itemIndex === itemIndex)

  return (
    <>
      {moves.length > 0 && (
        <div css={actionSectionCss}>
          <PlayMoveButton move={moves[0]} onPlay={closeDialog} css={actionButtonCss}>
            {t('help.action.take-bonus')}
          </PlayMoveButton>
        </div>
      )}
      <div css={containerCss}>
        <div css={titleCss}>{t('help.bonus.title')}</div>
        <div css={descriptionCss}>
          {bonusEffect && <EffectText effect={bonusEffect} />}
        </div>
      </div>
    </>
  )
}

const containerCss = css`
  min-width: 15em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`

const titleCss = css`
  font-size: 1.1em;
  font-weight: 700;
  color: #3e3020;
`

const descriptionCss = css`
  font-size: 1em;
  color: #3e3020;
  line-height: 1.5;
`
