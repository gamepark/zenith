/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme, ThemeProvider } from '@emotion/react'
import { buttonCss, RulesDialog } from '@gamepark/react-game'
import { FC, ReactNode } from 'react'

type ZenithDialogProps = {
  open: boolean
  close?: () => void
  children: ReactNode
  css?: Interpolation<Theme>
}

export const ZenithDialog: FC<ZenithDialogProps> = ({ open, close, children, css: customCss }) => {
  return (
    <RulesDialog open={open} close={close} css={[dialogCss, customCss]}>
      <ThemeProvider theme={theme => ({ ...theme, buttons: buttonCss('#d4872a', 'rgba(212,135,42,0.12)', 'rgba(212,135,42,0.2)') })}>
        <div css={contentCss}>
          {children}
        </div>
      </ThemeProvider>
    </RulesDialog>
  )
}

// Extra styles on top of the theme
const dialogCss = css`
  background: linear-gradient(135deg, #f8f2e8 0%, #f0e8d8 100%) !important;
  padding: 0;
`

const contentCss = css`
  padding: 2.5em 4em 3em;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
`
