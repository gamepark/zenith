import { css } from '@emotion/react'

export const actionSectionCss = css`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  padding: 0.3em 0.5em 0.5em;
  margin: 0 -0.5em 0.5em;
  border-bottom: 1px solid #e5e7eb;
  background: #f5f0e8;
`

export const actionButtonCss = css`
  background: #f5f0e8;
  color: #2d3748;
  border: 2px solid #d4c8b8;
  border-radius: 0.4em;
  padding: 0.35em 0.9em;
  font-weight: 600;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-shadow: 0 0.05em 0.15em rgba(0, 0, 0, 0.12);

  &:hover {
    background: #ebe4d8;
    border-color: #b8a99a;
    box-shadow: 0 0.08em 0.25em rgba(0, 0, 0, 0.18);
  }

  &:active {
    background: #e0d7c9;
    box-shadow: 0 0.02em 0.05em rgba(0, 0, 0, 0.1);
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    box-shadow: none;
    transform: none;
  }
`
