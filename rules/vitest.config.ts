import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node'
  },
  ssr: {
    noExternal: ['@gamepark/rules-api', 'es-toolkit']
  }
})
