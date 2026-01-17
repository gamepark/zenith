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
      <ThemeProvider theme={theme => ({ ...theme, buttons: buttonCss('#2d3748', '#e8e0d5', '#d4c8b8') })}>
        <div css={contentCss}>
          {children}
        </div>
      </ThemeProvider>
    </RulesDialog>
  )
}

// Extra styles on top of the theme
const dialogCss = css`
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
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
