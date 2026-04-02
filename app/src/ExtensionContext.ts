import { Memory } from '@gamepark/zenith/rules/Memory'
import { usePlayerId, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'zenith:secret-agent-seen'

export const ExtensionDialogContext = createContext<(() => void) | undefined>(undefined)

export const useOpenExtensionDialog = () => useContext(ExtensionDialogContext)

export const useExtensionDialog = () => {
  const rules = useRules<MaterialRules>()
  const playerId = usePlayerId()
  const hasExtension = !!playerId && rules?.remind(Memory.SecretAgent) === true
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!hasExtension) return
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      setShow(true)
    }
  }, [hasExtension])

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setShow(false)
  }, [])

  const reopen = useCallback(() => {
    setShow(true)
  }, [])

  return { show, dismiss, reopen }
}
