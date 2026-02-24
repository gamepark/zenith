import { GameProvider, GameTheme, setupTranslation } from '@gamepark/react-game'
import { ZenithTutorial } from './tutorial/ZenithTutorial'
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
    color: '#2d3748'
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
      tutorial={new ZenithTutorial()}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
