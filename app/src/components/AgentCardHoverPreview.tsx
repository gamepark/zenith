/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Agent } from '@gamepark/zenith/material/Agent'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { AgentCardHelpContent } from '../material/AgentCardHelp'
import { CursorTooltip } from './CursorTooltip'

const HOVER_DELAY_MS = 500
const TOOLTIP_OFFSET = 100 // Offset in px to avoid overlapping the card

// Find agent ID from CSS custom property --agent-id
const findAgentFromElement = (element: Element | null): Agent | null => {
  if (!element) return null

  // Check the element itself and its children
  const checkElement = (el: Element): Agent | null => {
    const style = getComputedStyle(el)
    const agentId = style.getPropertyValue('--agent-id').trim()
    if (agentId && agentId !== '') {
      const id = parseInt(agentId, 10)
      if (!isNaN(id)) {
        return id as Agent
      }
    }
    return null
  }

  // First check the element and traverse up
  let current: Element | null = element
  while (current) {
    const found = checkElement(current)
    if (found !== null) return found

    // Also check direct children
    for (const child of Array.from(current.children)) {
      const foundInChild = checkElement(child)
      if (foundInChild !== null) return foundInChild
    }

    current = current.parentElement
  }

  return null
}

export const AgentCardHoverPreview: FC = () => {
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAgentRef = useRef<Agent | null>(null)
  const cursorRef = useRef({ x: 0, y: 0 })
  const isMouseDownRef = useRef(false)

  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Track cursor position in ref (not state, to avoid re-renders)
      cursorRef.current = { x: e.clientX, y: e.clientY }

      const element = document.elementFromPoint(e.clientX, e.clientY)
      const agent = findAgentFromElement(element)

      if (agent !== lastAgentRef.current) {
        lastAgentRef.current = agent
        clearHoverTimeout()

        if (agent !== null) {
          // If tooltip is already showing, update immediately
          if (hoveredAgent !== null) {
            setCursor({ ...cursorRef.current })
            setHoveredAgent(agent)
            return
          }

          // Otherwise wait before showing
          timeoutRef.current = setTimeout(() => {
            // Don't show tooltip if mouse is down (dragging)
            if (isMouseDownRef.current) return
            // Re-check if cursor is still on the same card before showing tooltip
            const currentElement = document.elementFromPoint(cursorRef.current.x, cursorRef.current.y)
            const currentAgent = findAgentFromElement(currentElement)
            if (currentAgent === agent) {
              setCursor({ ...cursorRef.current })
              setHoveredAgent(agent)
            }
          }, HOVER_DELAY_MS)
        } else {
          setHoveredAgent(null)
        }
      }
    },
    [clearHoverTimeout, hoveredAgent]
  )

  const handleMouseDown = useCallback(() => {
    isMouseDownRef.current = true
    clearHoverTimeout()
    setHoveredAgent(null)
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

  return (
    <CursorTooltip cursor={cursor} offset={TOOLTIP_OFFSET} css={previewContainerCss}>
      <AgentCardHelpContent agentId={hoveredAgent} compact />
    </CursorTooltip>
  )
}

const previewContainerCss = css`
  font-size: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`
