import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { AIProvider, AIConfig } from '../services/ai'

interface SettingsContextType {
  provider: AIProvider
  apiKey: string
  isAIEnabled: boolean
  setProvider: (provider: AIProvider) => void
  setApiKey: (key: string) => void
  clearApiKey: () => void
  getAIConfig: () => AIConfig | null
}

const SettingsContext = createContext<SettingsContextType | null>(null)

const STORAGE_KEY_PROVIDER = 'boa-ai-provider'
const STORAGE_KEY_API = 'boa-ai-key'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [provider, setProviderState] = useState<AIProvider>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROVIDER)
      return stored === 'openai' || stored === 'anthropic' ? stored : 'openai'
    } catch {
      return 'openai'
    }
  })

  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_API) ?? ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROVIDER, provider)
    } catch {
      // localStorage unavailable
    }
  }, [provider])

  useEffect(() => {
    try {
      if (apiKey) {
        localStorage.setItem(STORAGE_KEY_API, apiKey)
      } else {
        localStorage.removeItem(STORAGE_KEY_API)
      }
    } catch {
      // localStorage unavailable
    }
  }, [apiKey])

  const setProvider = useCallback((p: AIProvider) => setProviderState(p), [])
  const setApiKey = useCallback((k: string) => setApiKeyState(k), [])
  const clearApiKey = useCallback(() => setApiKeyState(''), [])

  const isAIEnabled = apiKey.trim().length > 0

  const getAIConfig = useCallback((): AIConfig | null => {
    if (!isAIEnabled) return null
    return { provider, apiKey: apiKey.trim() }
  }, [provider, apiKey, isAIEnabled])

  return (
    <SettingsContext.Provider
      value={{
        provider,
        apiKey,
        isAIEnabled,
        setProvider,
        setApiKey,
        clearApiKey,
        getAIConfig,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
