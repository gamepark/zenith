/** @jsxImportSource @emotion/react */
import { css, Interpolation, keyframes, Theme, ThemeProvider } from '@emotion/react'
import { buttonCss, RulesDialog } from '@gamepark/react-game'
import { FC, ReactNode } from 'react'

type ZenithDialogProps = {
  open: boolean
  close?: () => void
  onBackdropClick?: () => void
  children: ReactNode
  css?: Interpolation<Theme>
}

export const ZenithDialog: FC<ZenithDialogProps> = ({ open, close, onBackdropClick, children, css: customCss }) => {
  return (
    <RulesDialog open={open} close={close} onBackdropClick={onBackdropClick} css={[dialogCss, customCss]}>
      <ThemeProvider theme={theme => ({ ...theme, buttons: buttonCss('#d4872a', 'rgba(212,135,42,0.12)', 'rgba(212,135,42,0.2)') })}>
        <div css={contentCss}>
          {children}
        </div>
      </ThemeProvider>
    </RulesDialog>
  )
}

// Corner fold close/minimize button (V6 rounded corner style)
export const CornerFoldButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <div css={foldButtonCss} onClick={onClick}>
    <span css={foldIconCss}>✕</span>
  </div>
)

// Minimized toast reopen button (B5 style from mockup)
export const MinimizedToast: FC<{ title: string, onClick: () => void }> = ({ title, onClick }) => (
  <div css={toastCss} onClick={onClick}>
    <div css={toastTextCss}>
      <span css={toastTitleCss}>{title}</span>
    </div>
    <span css={toastBtnCss}>Open</span>
  </div>
)

const toastSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(1em);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`

const toastPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0.06em rgba(212, 135, 42, 0.1), 0 0.25em 1em rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 0 0.2em rgba(212, 135, 42, 0.4), 0 0.25em 1.25em rgba(212, 135, 42, 0.2);
  }
`

const toastCss = css`
  position: fixed;
  bottom: 1em;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.6em 0.7em 0.6em 1em;
  background: linear-gradient(135deg, #f8f2e8 0%, #f0e8d8 100%);
  border-radius: 0.6em;
  box-shadow: 0 0 0 0.06em rgba(212, 135, 42, 0.1), 0 0.25em 1em rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 100;
  white-space: nowrap;
  animation: ${toastSlideUp} 0.35s ease-out forwards, ${toastPulse} 2s ease-in-out 0.35s infinite;

  &:hover {
    animation: ${toastSlideUp} 0.35s ease-out forwards;
  }
`

const toastTextCss = css`
  display: flex;
  flex-direction: column;
`

const toastTitleCss = css`
  font-size: 0.85em;
  font-weight: 700;
  color: #3e3020;
`

const toastBtnCss = css`
  padding: 0.35em 0.8em;
  background: linear-gradient(135deg, #d4872a, #b87020);
  color: #fff;
  border-radius: 0.4em;
  font-size: 0.7em;
  font-weight: 600;
  box-shadow: 0 0.12em 0.4em rgba(212, 135, 42, 0.3);
`

// Extra styles on top of the theme
const dialogAppear = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const dialogCss = css`
  background: linear-gradient(135deg, #f8f2e8 0%, #f0e8d8 100%) !important;
  padding: 0;
  animation: ${dialogAppear} 0.3s ease-out;
`


const contentCss = css`
  padding: 2.5em 4em 3em;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
`

// Corner fold button styles (V6 rounded corner)
const foldButtonCss = css`
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  z-index: 100;
  background: #d4872a;
  border-radius: 0 0.75em 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -0.06em 0.06em 0.25em rgba(0, 0, 0, 0.15);
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.15);
  }
`

const foldIconCss = css`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
  margin-top: -0.15rem;
  margin-right: -0.1rem;
`
