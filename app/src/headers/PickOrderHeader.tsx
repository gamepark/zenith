/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Avatar, PlayMoveButton, RulesDialog, useLegalMoves, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'
import { PlayerId } from '@gamepark/zenith/PlayerId'
import { CustomMoveType } from '@gamepark/zenith/rules/CustomMoveType'
import { Memory } from '@gamepark/zenith/rules/Memory'
import { getTeamColor, TeamColor } from '@gamepark/zenith/TeamColor'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { useTranslation } from 'react-i18next'

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
        <RulesDialog open={true} css={[dialogCss, isWhiteTeam ? whiteDialogCss : blackDialogCss]}>
          <div css={dialogContentCss}>
            <h2 css={[titleCss, isWhiteTeam ? whiteTitleCss : blackTitleCss]}>{t('header.pick-order.title')}</h2>
            <p css={subtitleCss}>{t('header.pick-order.subtitle')}</p>
            <div css={buttonContainerCss}>
              <PlayMoveButton move={legalMoves[0]} css={[dialogButtonCss, isWhiteTeam ? whiteButtonCss : blackButtonCss]}>
                <div css={avatarWrapperCss}>
                  <Avatar playerId={player1} css={avatarCss} />
                </div>
                <span css={buttonTextCss}>{player1Name}</span>
              </PlayMoveButton>
              <PlayMoveButton move={legalMoves[1]} css={[dialogButtonCss, isWhiteTeam ? whiteButtonCss : blackButtonCss]}>
                <div css={avatarWrapperCss}>
                  <Avatar playerId={player2} css={avatarCss} />
                </div>
                <span css={buttonTextCss}>{player2Name}</span>
              </PlayMoveButton>
            </div>
          </div>
        </RulesDialog>
      </>
    )
  }

  if (players.length > 0) {
    const teamName = t(`team.${currentTeam}`)
    return <span>{t('header.pick-order.waiting', { team: teamName })}</span>
  }

  return null
}

const dialogCss = css`
  border-radius: 1.5em;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
`

const whiteDialogCss = css`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 240, 245, 0.95) 100%);
  border: 3px solid rgba(200, 200, 210, 0.8);
`

const blackDialogCss = css`
  background: linear-gradient(135deg, rgba(35, 35, 40, 0.98) 0%, rgba(20, 20, 25, 0.95) 100%);
  border: 3px solid rgba(70, 70, 80, 0.8);
`

const dialogContentCss = css`
  padding: 2.5em 4em 3em;
  text-align: center;
`

const titleCss = css`
  font-size: 3em;
  margin: 0 0 0.2em 0;
  font-weight: 600;
`

const whiteTitleCss = css`
  color: #333;
`

const blackTitleCss = css`
  color: #e8e8e8;
`

const subtitleCss = css`
  color: #888;
  font-size: 1.5em;
  margin: 0 0 1.5em 0;
`

const buttonContainerCss = css`
  display: flex;
  gap: 3em;
  justify-content: center;
`

const dialogButtonCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8em;
  padding: 1.5em 2em;
  border-radius: 1em;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-4px);
  }
`

const whiteButtonCss = css`
  background: linear-gradient(135deg, #f0f0f5 0%, #e0e0e8 100%);
  border: 2px solid #c0c0c8;
  color: #333;

  &:hover {
    background: linear-gradient(135deg, #e8e8f0 0%, #d8d8e0 100%);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`

const blackButtonCss = css`
  background: linear-gradient(135deg, #3a3a42 0%, #2a2a32 100%);
  border: 2px solid #505058;
  color: #e8e8e8;

  &:hover {
    background: linear-gradient(135deg, #454550 0%, #353540 100%);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
`

const avatarWrapperCss = css`
  position: relative;
  width: 5em;
  height: 5em;
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
  font-size: 1.6em;
  font-weight: 600;
`
