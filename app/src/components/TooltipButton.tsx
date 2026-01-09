/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { PlayMoveButton } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'

// Styles partagés pour le tooltip (en JS pur pour le DOM)
const tooltipStyles = `
  position: fixed;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #e8e8e8;
  padding: 0.6em 1em;
  border-radius: 8px;
  font-size: 13px;
  max-width: 250px;
  text-align: center;
  line-height: 1.4;
  pointer-events: none;
  z-index: 10000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 20px rgba(100, 100, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
`

const arrowStyles = `
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-bottom-color: #1a1a2e;
`

// Hook partagé pour la logique tooltip
const useTooltip = (tooltip: string) => {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      })
      setShow(true)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShow(false)
  }, [])

  useEffect(() => {
    if (show) {
      if (!tooltipRef.current) {
        const div = document.createElement('div')
        div.style.cssText = tooltipStyles
        div.style.left = `${position.x}px`
        div.style.top = `${position.y}px`
        div.innerHTML = `${tooltip}<div style="${arrowStyles}"></div>`
        document.body.appendChild(div)
        tooltipRef.current = div
      } else {
        tooltipRef.current.style.left = `${position.x}px`
        tooltipRef.current.style.top = `${position.y}px`
      }
    } else if (tooltipRef.current) {
      document.body.removeChild(tooltipRef.current)
      tooltipRef.current = null
    }

    return () => {
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current)
        tooltipRef.current = null
      }
    }
  }, [show, position, tooltip])

  return { buttonRef, handleMouseEnter, handleMouseLeave }
}

// Pour wrapping de contenu arbitraire (utilisé dans des composants React)
type TooltipButtonProps = {
  children: ReactNode
  tooltip: string
}

export const TooltipButton: FC<TooltipButtonProps> = ({ children, tooltip }) => {
  const { buttonRef, handleMouseEnter, handleMouseLeave } = useTooltip(tooltip)

  return (
    <span ref={buttonRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} css={wrapperCss}>
      {children}
    </span>
  )
}

// Pour utilisation dans i18next Trans (reçoit children = texte du bouton)
type TooltipPlayMoveButtonProps = {
  move: MaterialMove | undefined
  tooltip: string
  children?: ReactNode
}

export const TooltipPlayMoveButton: FC<TooltipPlayMoveButtonProps> = ({ move, tooltip, children }) => {
  const { buttonRef, handleMouseEnter, handleMouseLeave } = useTooltip(tooltip)

  return (
    <span ref={buttonRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} css={wrapperCss}>
      <PlayMoveButton move={move}>{children}</PlayMoveButton>
    </span>
  )
}

const wrapperCss = css`
  display: inline;
`
