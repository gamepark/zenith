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
  border-bottom: 1px solid rgba(212, 135, 42, 0.15);
  background: #f5efe4;
`

export const actionButtonCss = css`
  background: linear-gradient(180deg, #f5efe4, #efe7d8);
  color: #3e3020;
  border: 1px solid rgba(212, 135, 42, 0.25);
  border-radius: 0.4em;
  padding: 0.35em 0.9em;
  font-weight: 600;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-shadow: 0 0.05em 0.15em rgba(0, 0, 0, 0.08);

  &:hover {
    background: linear-gradient(180deg, #efe7d8, #e8dece);
    border-color: rgba(212, 135, 42, 0.4);
    box-shadow: 0 0.08em 0.25em rgba(212, 135, 42, 0.15);
  }

  &:active {
    background: #e8dece;
    box-shadow: 0 0.02em 0.05em rgba(0, 0, 0, 0.06);
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    box-shadow: none;
    transform: none;
  }
`
