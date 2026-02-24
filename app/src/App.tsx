/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react'
import { FailuresDialog, FullscreenDialog, LoadingScreen, MaterialHeader, MaterialImageLoader, Menu, useGame } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { useEffect, useState } from 'react'
import { GameDisplay } from './GameDisplay'
import { Headers } from './headers/Headers'

export default function App() {
  const game = useGame<MaterialGame>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  const [isImagesLoading, setImagesLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])

  useEffect(() => {
    if (game?.helpDisplay) {
      document.documentElement.classList.add('help-open')
    } else {
      document.documentElement.classList.remove('help-open')
    }
  }, [game?.helpDisplay])

  const loading = !game || isJustDisplayed || isImagesLoading
  return (
    <>
      <Global styles={helpDialogOverrides} />
      {!!game && <GameDisplay players={game.players.length} />}
      <LoadingScreen display={loading} author="Someone" artist="Somebody" publisher="Nobody" developer="You" />
      <MaterialHeader rulesStepsHeaders={Headers} loading={loading} />
      <MaterialImageLoader onImagesLoad={() => setImagesLoading(false)} />
      <Menu />
      <FailuresDialog />
      <FullscreenDialog />
    </>
  )
}

const helpDialogOverrides = css`
  /* Close button */
  .help-open .svg-inline--fa.fa-xmark {
    top: -0.3em !important;
    right: -0.3em !important;
    width: 0.7em !important;
    height: 0.7em !important;
    padding: 0.2em;
    background: #f5f0e8;
    border: 2px solid #d4c8b8;
    border-radius: 50%;
    box-shadow: 0 0.05em 0.15em rgba(0, 0, 0, 0.3);
    color: #4a5568;
    transition: all 0.15s ease;

    &:hover {
      background: #e8e0d5;
      color: #1a202c;
      transform: scale(1.1);
    }
  }

  /* Navigation arrows */
  .help-open div:has(> .fa-chevron-left),
  .help-open div:has(> .fa-chevron-right) {
    z-index: 1 !important;
    background: #f5f0e8 !important;
    border: 2px solid #d4c8b8 !important;
    border-radius: 50% !important;
    box-shadow: 0 0.08em 0.25em rgba(0, 0, 0, 0.2) !important;
    color: #4a5568 !important;
    width: 1em !important;
    height: 1em !important;
    padding: 0 !important;
    transition: all 0.15s ease !important;
    animation: none !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    & > svg {
      width: 0.4em !important;
      height: 0.4em !important;
    }

    &:hover {
      background: #ebe4d8 !important;
      border-color: #b8a99a !important;
      color: #1a202c !important;
      box-shadow: 0 0.1em 0.35em rgba(0, 0, 0, 0.25) !important;
      transform: translateY(-50%) scale(1.08) !important;
    }

    &:active {
      background: #e0d7c9 !important;
      box-shadow: 0 0.04em 0.1em rgba(0, 0, 0, 0.15) !important;
      transform: translateY(-50%) scale(0.95) !important;
    }
  }

  .help-open div:has(> .fa-chevron-left) {
    left: -0.6em !important;
  }

  .help-open div:has(> .fa-chevron-right) {
    right: -0.6em !important;
  }

  /* Keep undo button above dialog backdrop */
  button:has(> .fa-rotate-left) {
    z-index: 1200 !important;
  }
`
