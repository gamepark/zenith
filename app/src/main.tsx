import { GameProvider } from '@gamepark/react-game'
import { ZenithTutorial } from './tutorial/ZenithTutorial'
import { ai } from '@gamepark/zenith/ZenithBot'
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
import { ZenithScoringDescription } from './scoring/ZenithScoringDescription'
import { zenithTheme } from './theme'

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
      scoring={new ZenithScoringDescription()}
      theme={zenithTheme}
      tutorial={new ZenithTutorial()}
      ai={ai}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
