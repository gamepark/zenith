/** @jsxImportSource @emotion/react */
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { ZenithOptionsSpec } from '@gamepark/zenith/ZenithOptions'
import { ZenithRules } from '@gamepark/zenith/ZenithRules'
import { ZenithSetup } from '@gamepark/zenith/ZenithSetup'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="zenith"
      Rules={ZenithRules}
      optionsSpec={ZenithOptionsSpec}
      GameSetup={ZenithSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
