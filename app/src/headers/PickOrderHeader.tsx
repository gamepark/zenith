/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Avatar, PlayMoveButton, useLegalMoves, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { useTranslation } from 'react-i18next'
import { ZenithDialog } from '../components/ZenithDialog'

export const PickOrderHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<ZenithRules>()!
  const players = rules.game.rule?.players ?? []
  const currentTeam = rules.remind<TeamColor>(Memory.CurrentTeam)

  const legalMoves = useLegalMoves<MaterialMove>((move) => isCustomMoveType(CustomMoveType.PickFirst)(move))

  const player1 = legalMoves[0]?.data as PlayerId | undefined
  const player2 = legalMoves[1]?.data as PlayerId | undefined
  const player1Name = usePlayerName(player1)
  const player2Name = usePlayerName(player2)

  const isWhiteTeam = player1 !== undefined ? getTeamColor(player1) === TeamColor.White : currentTeam === TeamColor.White

  // Show dialog if we have legal moves to pick
  if (legalMoves.length > 0) {
    return (
      <>
        <span>{t('header.pick-order.choose')}</span>
        <ZenithDialog open={true} css={isWhiteTeam ? whiteDialogCss : blackDialogCss}>
          <div css={dialogContentCss}>
            <h2 css={titleCss}>{t('header.pick-order.title')}</h2>
            <p css={subtitleCss}>{t('header.pick-order.subtitle')}</p>
            <div css={buttonContainerCss}>
              <PlayMoveButton move={legalMoves[0]} css={dialogButtonCss}>
                <div css={avatarWrapperCss}>
                  <Avatar playerId={player1} css={avatarCss} />
                </div>
                <span css={buttonTextCss}>{player1Name}</span>
              </PlayMoveButton>
              <PlayMoveButton move={legalMoves[1]} css={dialogButtonCss}>
                <div css={avatarWrapperCss}>
                  <Avatar playerId={player2} css={avatarCss} />
                </div>
                <span css={buttonTextCss}>{player2Name}</span>
              </PlayMoveButton>
            </div>
          </div>
        </ZenithDialog>
      </>
    )
  }

  if (players.length > 0) {
    const teamName = t(`team.${currentTeam}`)
    return <span>{t('header.pick-order.waiting', { team: teamName })}</span>
  }

  return null
}

const whiteDialogCss = css`
  border-left: 4px solid #a0a0a8;
`

const blackDialogCss = css`
  background: linear-gradient(135deg, rgba(50, 50, 55, 0.97) 0%, rgba(35, 35, 40, 0.95) 100%);
  border-left: 4px solid #707078;

  h2, span {
    color: #e8e8ec;
  }
  p {
    color: #a0a0a8;
  }
`

const dialogContentCss = css`
  text-align: center;
`

const titleCss = css`
  font-size: 2.2em;
  margin: 0 0 0.2em 0;
  font-weight: 600;
  color: #2d3748;
`

const subtitleCss = css`
  color: #666;
  font-size: 1.2em;
  margin: 0 0 1.5em 0;
`

const buttonContainerCss = css`
  display: flex;
  gap: 2em;
  justify-content: center;
`

const dialogButtonCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  padding: 1.2em 1.8em;
  border-radius: 0.8em;
  cursor: pointer;
  transition: all 0.15s ease;
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    background: rgba(0, 0, 0, 0.08);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`

const avatarWrapperCss = css`
  position: relative;
  width: 4em;
  height: 4em;
  flex-shrink: 0;
`

const avatarCss = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const buttonTextCss = css`
  font-size: 1.3em;
  font-weight: 600;
`
