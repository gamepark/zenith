/* eslint-disable react-refresh/only-export-components */
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC, PropsWithChildren, useState } from 'react'
import { Trans } from 'react-i18next'

export const actionSectionCss = css`
  display: flex;
  gap: 0.4em;
  flex-wrap: wrap;
  padding: 0.3em 0;
`

export const actionButtonCss = css`
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #d4872a, #c07824);
  color: #fff;
  border: none;
  border-radius: 0.4em;
  padding: 0.5em 1em;
  font-weight: 700;
  font-size: 0.95em;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-shadow: 0 0.1em 0.3em rgba(212, 135, 42, 0.35);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  animation: pulse 2s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    animation: shine 3s ease-in-out infinite;
  }

  @keyframes shine {
    0%, 100% { left: -100%; }
    50% { left: 150%; }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0.1em 0.3em rgba(212, 135, 42, 0.35); }
    50% { box-shadow: 0 0.15em 0.5em rgba(212, 135, 42, 0.55), 0 0 0.8em rgba(212, 135, 42, 0.15); }
  }

  &:hover {
    background: linear-gradient(180deg, #e09530, #d4872a);
    box-shadow: 0 0.15em 0.4em rgba(212, 135, 42, 0.45);
    animation: none;
  }

  &:active {
    background: #a8691f;
    box-shadow: 0 0.05em 0.1em rgba(0, 0, 0, 0.15);
    transform: scale(0.97);
    animation: none;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    box-shadow: none;
    transform: none;
    animation: none;
    &::after { display: none; }
  }
`

type CollapsibleDetailsProps = PropsWithChildren<{}>

export const CollapsibleDetails: FC<CollapsibleDetailsProps> = ({ children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div css={detailsToggleCss} onClick={() => setOpen(!open)}>
        <div css={detailsIconCss}>i</div>
        <span css={detailsTextCss}>
          <Trans defaults="Details" i18nKey="help.details" />
        </span>
        <span css={[detailsArrowCss, open && detailsArrowOpenCss]}>▼</span>
      </div>
      {open && children}
    </div>
  )
}

export const actionsLabelCss = css`
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.75em;
  font-weight: 700;
  color: #d4872a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 0.3em;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 135, 42, 0.3));
  }

  &::after {
    background: linear-gradient(90deg, rgba(212, 135, 42, 0.3), transparent);
  }
`

const detailsToggleCss = css`
  width: 100%;
  margin-top: 0.6em;
  margin-bottom: 0.4em;
  cursor: pointer;
  user-select: none;
  background: linear-gradient(135deg, rgba(62, 48, 32, 0.04), rgba(212, 135, 42, 0.06));
  border: 1px solid rgba(212, 135, 42, 0.15);
  border-radius: 0.4em;
  padding: 0.45em 0.9em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(62, 48, 32, 0.06), rgba(212, 135, 42, 0.1));
    border-color: rgba(212, 135, 42, 0.3);
    box-shadow: 0 1px 4px rgba(212, 135, 42, 0.1);
  }
`

const detailsIconCss = css`
  width: 1.15em;
  height: 1.15em;
  background: linear-gradient(135deg, #d4872a, #c07824);
  border-radius: 0.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7em;
  font-weight: 700;
  font-style: italic;
  line-height: 1;
  padding-right: 0.1em;
  box-shadow: 0 1px 3px rgba(212, 135, 42, 0.3);
  flex-shrink: 0;
  margin-right: 0.4em;
`

const detailsTextCss = css`
  flex: 1;
  font-size: 0.75em;
  font-weight: 700;
  color: #5a4a38;
  letter-spacing: 0.03em;
`

const detailsArrowCss = css`
  color: #d4872a;
  font-size: 0.55em;
  transition: transform 0.3s ease;
  flex-shrink: 0;
`

const detailsArrowOpenCss = css`
  transform: rotate(180deg);
`
