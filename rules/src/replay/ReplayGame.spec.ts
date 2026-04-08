import { Action, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { ZenithRules } from '../ZenithRules'

/**
 * Replay test: loads a saved game state (setup + actions) and replays every move
 * to find where a crash occurs (e.g. "You are trying to delete an item that does not exist").
 *
 * HOW TO USE:
 * 1. Save the game JSON from the server as: rules/src/replay/game-data.json
 *    The JSON must have a `setup` object and an `actions` array.
 * 2. Run: cd rules && npx vitest run src/replay/ReplayGame.spec.ts
 *
 * Three test modes:
 *   - "exact consequences": replays moves + server-recorded consequences verbatim
 *   - "playConsequences": replays only the player moves, lets rules generate consequences
 *   - "divergence finder": compares server consequences vs generated consequences per action
 */

type GameData = {
  setup: MaterialGame<PlayerId, MaterialType, LocationType>
  actions: Action<MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId>[]
}

function loadGameData(): GameData | null {
  const jsonPath = resolve(__dirname, 'game-data.json')
  if (!existsSync(jsonPath)) {
    return null
  }
  const raw = readFileSync(jsonPath, 'utf-8')
  return JSON.parse(raw) as GameData
}

describe('Replay Game', () => {
  const gameData = loadGameData()

  it('should replay all actions without crashing (exact consequences)', () => {
    if (!gameData) {
      console.warn('No game data found. Place game-data.json in rules/src/replay/')
      return
    }

    const rules = new ZenithRules(structuredClone(gameData.setup))
    const actions = gameData.actions

    console.log(`Replaying ${actions.length} actions (exact consequences mode)...`)

    for (let actionIdx = 0; actionIdx < actions.length; actionIdx++) {
      const action = actions[actionIdx]
      const { move, consequences } = action

      // Play the action's main move
      try {
        const returned = rules.play(move)
        if (returned.length !== consequences.length) {
          console.log(
            `  Action ${actionIdx}: server had ${consequences.length} consequences, rules generated ${returned.length}`
          )
        }
      } catch (error: any) {
        console.error(`\n=== CRASH at action ${actionIdx}, MAIN MOVE ===`)
        console.error('Move:', JSON.stringify(move, null, 2))
        console.error('Rule state:', JSON.stringify(rules.game.rule, null, 2))
        console.error('Error:', error.message)
        expect.fail(`Crash at action ${actionIdx}, main move: ${error.message}`)
      }

      // Play each consequence in the exact order from the server
      for (let consIdx = 0; consIdx < consequences.length; consIdx++) {
        const consequence = consequences[consIdx]
        try {
          rules.play(consequence)
        } catch (error: any) {
          console.error(`\n=== CRASH at action ${actionIdx}, consequence ${consIdx}/${consequences.length} ===`)
          console.error('Consequence move:', JSON.stringify(consequence, null, 2))
          console.error('Rule state:', JSON.stringify(rules.game.rule, null, 2))
          if ('itemType' in consequence) {
            const itemType = (consequence as any).itemType as MaterialType
            const items = rules.game.items[itemType]
            if (items && 'itemIndex' in consequence) {
              const idx = (consequence as any).itemIndex
              console.error(`Item[${itemType}][${idx}]:`, JSON.stringify(items[idx], null, 2))
              console.error(`Total items of type ${itemType}: ${items.length}`)
            }
          }
          console.error('Error:', error.message)
          expect.fail(`Crash at action ${actionIdx}, consequence ${consIdx}: ${error.message}`)
        }
      }
    }

    console.log(`Successfully replayed all ${actions.length} actions.`)
  })

  it('should replay with playConsequences (auto-generated consequences)', () => {
    if (!gameData) {
      console.warn('No game data found. Place game-data.json in rules/src/replay/')
      return
    }

    const rules = new ZenithRules(structuredClone(gameData.setup))
    const actions = gameData.actions

    console.log(`Replaying ${actions.length} actions (playConsequences mode)...`)

    for (let actionIdx = 0; actionIdx < actions.length; actionIdx++) {
      const action = actions[actionIdx]

      try {
        const consequences = rules.play(action.move)
        while (consequences.length > 0) {
          const next = consequences.shift()!
          consequences.push(...rules.play(next))
        }
      } catch (error: any) {
        console.error(`\n=== CRASH at action ${actionIdx} (playConsequences mode) ===`)
        console.error('Action move:', JSON.stringify(action.move, null, 2))
        console.error('Rule state:', JSON.stringify(rules.game.rule, null, 2))
        console.error('Error:', error.message)
        expect.fail(`Crash at action ${actionIdx} (playConsequences): ${error.message}`)
      }
    }

    console.log(`Successfully replayed all ${actions.length} actions with playConsequences.`)
  })

  it('should find first divergence between server consequences and generated consequences', () => {
    if (!gameData) {
      console.warn('No game data found. Place game-data.json in rules/src/replay/')
      return
    }

    const rules = new ZenithRules(structuredClone(gameData.setup))
    const actions = gameData.actions

    console.log(`Checking ${actions.length} actions for consequence divergence...`)

    for (let actionIdx = 0; actionIdx < actions.length; actionIdx++) {
      const action = actions[actionIdx]
      const serverConsequences = action.consequences

      // Save state before playing
      const stateBefore = JSON.stringify(rules.game)

      let generatedConsequences: MaterialMove[]
      try {
        generatedConsequences = rules.play(action.move)
      } catch (error: any) {
        console.error(`\n=== CRASH at action ${actionIdx} generating consequences ===`)
        console.error('Move:', JSON.stringify(action.move, null, 2))
        console.error('Error:', error.message)
        expect.fail(`Crash at action ${actionIdx}: ${error.message}`)
        return
      }

      // Compare consequences
      const serverStr = JSON.stringify(serverConsequences)
      const generatedStr = JSON.stringify(generatedConsequences)

      if (serverStr !== generatedStr) {
        console.error(`\n=== DIVERGENCE at action ${actionIdx} (player ${action.playerId}) ===`)
        console.error('Move:', JSON.stringify(action.move, null, 2))
        console.error('Rule before move:', JSON.stringify(JSON.parse(stateBefore).rule, null, 2))
        console.error(`Server consequences (${serverConsequences.length}):`)
        serverConsequences.forEach((c, i) => console.error(`  [${i}]`, JSON.stringify(c)))
        console.error(`Generated consequences (${generatedConsequences.length}):`)
        generatedConsequences.forEach((c, i) => console.error(`  [${i}]`, JSON.stringify(c)))

        // Find first different consequence
        const maxLen = Math.max(serverConsequences.length, generatedConsequences.length)
        for (let i = 0; i < maxLen; i++) {
          const s = JSON.stringify(serverConsequences[i])
          const g = JSON.stringify(generatedConsequences[i])
          if (s !== g) {
            console.error(`\nFirst difference at consequence index ${i}:`)
            console.error('  Server:    ', s ?? '(missing)')
            console.error('  Generated: ', g ?? '(missing)')
            break
          }
        }

        // Continue with server consequences to match the server state
        // (rollback and replay with server consequences)
        const replayRules = new ZenithRules(JSON.parse(stateBefore))
        replayRules.play(action.move)
        for (const c of serverConsequences) {
          try {
            replayRules.play(c)
          } catch {
            // If server consequences crash too, note it
            console.error('Note: server consequences also crash on this diverged state')
            break
          }
        }

        expect.fail(`Divergence found at action ${actionIdx}`)
        return
      }

      // Play server consequences to stay in sync
      for (const c of serverConsequences) {
        try {
          rules.play(c)
        } catch (error: any) {
          console.error(`\n=== CRASH playing server consequence at action ${actionIdx} ===`)
          console.error('Error:', error.message)
          expect.fail(`Crash at action ${actionIdx}: ${error.message}`)
          return
        }
      }
    }

    console.log(`All ${actions.length} actions have matching consequences.`)
  })
})
