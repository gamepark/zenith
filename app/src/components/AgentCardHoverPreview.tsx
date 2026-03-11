/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Agent } from '@gamepark/zenith/material/Agent'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AgentCardHelpContent } from '../material/AgentCardHelp'

const HOVER_DELAY_MS = 500
const TOOLTIP_GAP = 4
const VIEWPORT_PADDING = 8
// Find agent ID from CSS custom property --agent-id, return the element that has it
const findAgentFromElement = (element: Element | null): { agent: Agent; element: Element } | null => {
  if (!element) return null

  const checkElement = (el: Element): Agent | null => {
    const style = getComputedStyle(el)
    const agentId = style.getPropertyValue('--agent-id').trim()
    if (agentId && agentId !== '') {
      const id = parseInt(agentId, 10)
      if (!isNaN(id)) return id as Agent
    }
    return null
  }

  let current: Element | null = element
  while (current) {
    const found = checkElement(current)
    if (found !== null) return { agent: found, element: current }

    for (const child of Array.from(current.children)) {
      const foundInChild = checkElement(child)
      if (foundInChild !== null) return { agent: foundInChild, element: child }
    }

    current = current.parentElement
  }

  return null
}

// el = MaterialComponent (has --agent-id via getItemExtraCss)
// el.children[0] = hoverWrapper (receives hover transform: scale(2) + rotation cancel)
// el.children[0].children[0] = front face (the visible card image)
// When hovered, front face getBoundingClientRect = exact visual rect, no rotation, correct scale.
const getCardRect = (el: Element): DOMRect => {
  // el = MaterialComponent (has --agent-id)
  // el.children[0] = hoverWrapper (receives scale(2) + rotation cancel on hover)
  // el.children[0].children[0] = front face (backface-visibility: hidden)
  const hoverWrapper = el.children[0]
  const frontFace = hoverWrapper?.children[0]
  // The front face rect when hovered = exact visual card rect (no rotation, scale applied)
  const target = frontFace ?? hoverWrapper ?? el
  return target.getBoundingClientRect()
}

export const AgentCardHoverPreview: FC = () => {
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)
  const [cardRect, setCardRect] = useState<DOMRect | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAgentRef = useRef<Agent | null>(null)
  const cursorRef = useRef({ x: 0, y: 0 })
  const isMouseDownRef = useRef(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Position tooltip relative to card rect
  useEffect(() => {
    if (!cardRect || !tooltipRef.current) {
      setPosition(null)
      return
    }

    requestAnimationFrame(() => {
      if (!tooltipRef.current || !cardRect) return
      const tooltip = tooltipRef.current.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      let x: number
      let y = cardRect.top

      const fitsRight = cardRect.right + TOOLTIP_GAP + tooltip.width <= vw - VIEWPORT_PADDING
      const fitsLeft = cardRect.left - TOOLTIP_GAP - tooltip.width >= VIEWPORT_PADDING

      if (fitsRight) {
        x = cardRect.right + TOOLTIP_GAP
      } else if (fitsLeft) {
        x = cardRect.left - TOOLTIP_GAP - tooltip.width
      } else {
        x = cardRect.left + (cardRect.width - tooltip.width) / 2
        x = Math.max(VIEWPORT_PADDING, Math.min(x, vw - tooltip.width - VIEWPORT_PADDING))
        const fitsAbove = cardRect.top - TOOLTIP_GAP - tooltip.height >= VIEWPORT_PADDING
        y = fitsAbove ? cardRect.top - TOOLTIP_GAP - tooltip.height : cardRect.bottom + TOOLTIP_GAP
        setPosition({ x, y })
        return
      }

      y = Math.max(VIEWPORT_PADDING, Math.min(y, vh - tooltip.height - VIEWPORT_PADDING))
      setPosition({ x, y })
    })
  }, [cardRect])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }

      const element = document.elementFromPoint(e.clientX, e.clientY)
      const result = findAgentFromElement(element)
      const agent = result?.agent ?? null

      if (agent !== lastAgentRef.current) {
        lastAgentRef.current = agent
        clearHoverTimeout()

        if (result !== null) {
          const capturedAgent = result.agent
          const capturedElement = result.element

          if (hoveredAgent !== null) {
            // Already showing tooltip — wait for hover transition (50ms) to settle
            setHoveredAgent(capturedAgent)
            setTimeout(() => setCardRect(getCardRect(capturedElement)), 60)
            return
          }

          timeoutRef.current = setTimeout(() => {
            if (isMouseDownRef.current) return
            const currentElement = document.elementFromPoint(cursorRef.current.x, cursorRef.current.y)
            const currentResult = findAgentFromElement(currentElement)
            if (currentResult?.agent === capturedAgent) {
              // After 500ms, hover transition is done — rect is the final hovered size
              setCardRect(getCardRect(capturedElement))
              setHoveredAgent(capturedAgent)
            }
          }, HOVER_DELAY_MS)
        } else {
          setHoveredAgent(null)
          setCardRect(null)
          setPosition(null)
        }
      }
    },
    [clearHoverTimeout, hoveredAgent]
  )

  const handleMouseDown = useCallback(() => {
    isMouseDownRef.current = true
    clearHoverTimeout()
    setHoveredAgent(null)
    setCardRect(null)
    setPosition(null)
  }, [clearHoverTimeout])

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      clearHoverTimeout()
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp, clearHoverTimeout])

  if (!hoveredAgent) return null

  return createPortal(
    <div
      ref={tooltipRef}
      css={previewContainerCss}
      style={{
        left: position?.x ?? -9999,
        top: position?.y ?? -9999
      }}
    >
      <AgentCardHelpContent agentId={hoveredAgent} compact />
    </div>,
    document.body
  )
}

const previewContainerCss = css`
  position: fixed;
  z-index: 10000;
  pointer-events: none;
  font-size: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`
