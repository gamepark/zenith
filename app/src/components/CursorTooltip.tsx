/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from '@emotion/react'
import { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Position = { x: number; y: number }

type CursorTooltipProps = {
  /** Current cursor position */
  cursor: Position
  /** Content to display in the tooltip */
  children: ReactNode
  /** Offset from cursor in pixels (default: 20) */
  offset?: number
  /** Padding from viewport edges in pixels (default: 8) */
  padding?: number
  /** Additional CSS styles */
  css?: Interpolation<Theme>
}

/**
 * Generic tooltip component that positions itself relative to cursor position.
 * Automatically adjusts to stay within viewport bounds.
 */
export const CursorTooltip: FC<CursorTooltipProps> = ({ cursor, children, offset = 20, padding = 8, css: customCss }) => {
  const [position, setPosition] = useState<Position | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!tooltipRef.current) return

    requestAnimationFrame(() => {
      if (!tooltipRef.current) return

      const tooltip = tooltipRef.current
      const rect = tooltip.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let x: number
      let y: number

      const fitsRight = cursor.x + offset + rect.width <= viewportWidth - padding
      const fitsLeft = cursor.x - offset - rect.width >= padding

      if (fitsRight) {
        // Right side
        x = cursor.x + offset
        y = cursor.y - rect.height / 2
        y = Math.max(padding, Math.min(y, viewportHeight - rect.height - padding))
      } else if (fitsLeft) {
        // Left side
        x = cursor.x - offset - rect.width
        y = cursor.y - rect.height / 2
        y = Math.max(padding, Math.min(y, viewportHeight - rect.height - padding))
      } else {
        // Neither side fits, try above or below
        x = cursor.x - rect.width / 2
        x = Math.max(padding, Math.min(x, viewportWidth - rect.width - padding))

        const fitsAbove = cursor.y - offset - rect.height >= padding
        if (fitsAbove) {
          y = cursor.y - offset - rect.height
        } else {
          y = cursor.y + offset
        }
      }

      setPosition({ x, y })
    })
  }, [cursor.x, cursor.y, offset, padding])

  return createPortal(
    <div
      ref={tooltipRef}
      css={[tooltipContainerCss, customCss]}
      style={{
        left: position?.x ?? -9999,
        top: position?.y ?? -9999
      }}
    >
      {children}
    </div>,
    document.body
  )
}

const tooltipContainerCss = css`
  position: fixed;
  z-index: 10000;
  pointer-events: none;
`
