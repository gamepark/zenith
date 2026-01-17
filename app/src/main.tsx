import { GameProvider, GameTheme, setupTranslation } from '@gamepark/react-game'
import { ZenithOptionsSpec } from '@gamepark/zenith/ZenithOptions'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { ZenithSetup } from '@gamepark/zenith/ZenithSetup'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import App from './App.tsx'
import { Locators } from './locators/Locators'
import { ZenithLogDescription } from './logs/ZenithLogDescription'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

const theme: Partial<GameTheme> = {
  dialog: {
    backgroundColor: '#f5f0e8',
    color: '#2d3748',
    borderRadius: '1.5em',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.25)',
    border: '3px solid #d4c8b8'
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="zenith"
      Rules={ZenithRules}
      optionsSpec={ZenithOptionsSpec}
      GameSetup={ZenithSetup}
      material={Material}
      logs={new ZenithLogDescription()}
      locators={Locators}
      animations={gameAnimations}
      theme={theme}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
