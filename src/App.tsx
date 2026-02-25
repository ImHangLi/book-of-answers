import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from 'react'
import { AnimatePresence } from 'framer-motion'
import AbstractBackground from './components/AbstractBackground'
import ParticleField from './components/ParticleField'
import PromptText from './components/PromptText'
import QuestionInput from './components/QuestionInput'
import AnswerDisplay from './components/AnswerDisplay'
import ContemplatingDisplay from './components/ContemplatingDisplay'
import SettingsButton from './components/SettingsButton'
import SettingsPage from './components/SettingsPage'
import { answers } from './data/answers'
import { useSettings } from './context/SettingsContext'
import { getAIAnswer, AIError } from './services/ai'

type Phase = 'asking' | 'contemplating' | 'answered'

const AI_TIMEOUT_MS = 15_000

function getRandomAnswer(exclude: string | null): string {
  let answer: string
  do {
    answer = answers[Math.floor(Math.random() * answers.length)]
  } while (answer === exclude && answers.length > 1)
  return answer
}

// Hash-based page routing via useSyncExternalStore
function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getHashSnapshot(): string {
  return window.location.hash
}

function useHash(): string {
  return useSyncExternalStore(subscribeToHash, getHashSnapshot)
}

export default function App() {
  const hash = useHash()
  const page = hash === '#settings' ? 'settings' : 'main'

  const [phase, setPhase] = useState<Phase>('asking')
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const lastAnswerRef = useRef<string | null>(null)
  const askAgainRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const { isAIEnabled, getAIConfig } = useSettings()

  const handleQuestionSubmit = useCallback(
    async (question: string) => {
      const config = getAIConfig()

      if (!config) {
        // Fallback: random answer
        const answer = getRandomAnswer(lastAnswerRef.current)
        lastAnswerRef.current = answer
        setCurrentAnswer(answer)
        setPhase('answered')
        return
      }

      // AI path
      setPhase('contemplating')
      setAiError(null)

      // Abort any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const timeout = setTimeout(() => controller.abort('timeout'), AI_TIMEOUT_MS)

      try {
        const answer = await getAIAnswer(config, question, controller.signal)
        clearTimeout(timeout)
        if (!controller.signal.aborted) {
          lastAnswerRef.current = answer
          setCurrentAnswer(answer)
          setPhase('answered')
        }
      } catch (err) {
        clearTimeout(timeout)
        if (err instanceof Error && err.name === 'AbortError') {
          // Check if this was a timeout abort (not user-initiated cancel)
          if (controller.signal.reason === 'timeout') {
            const fallback = getRandomAnswer(lastAnswerRef.current)
            lastAnswerRef.current = fallback
            setCurrentAnswer(fallback)
            setPhase('answered')
            setAiError('The oracle took too long to respond. A random answer was chosen.')
          }
          return
        }

        // On AI failure, fall back to random answer
        const fallback = getRandomAnswer(lastAnswerRef.current)
        lastAnswerRef.current = fallback
        setCurrentAnswer(fallback)
        setPhase('answered')

        if (err instanceof AIError) {
          if (err.statusCode === 401) {
            setAiError('Your key was not accepted. Check your settings.')
          } else if (err.statusCode === 429) {
            setAiError('Rate limit reached. A random answer was chosen.')
          } else {
            setAiError(err.message)
          }
        } else {
          setAiError('The oracle could not be reached. A random answer was chosen.')
        }
      }
    },
    [getAIConfig]
  )

  const handleAskAgain = useCallback(() => {
    abortRef.current?.abort()
    setPhase('asking')
    setCurrentAnswer(null)
    setAiError(null)
  }, [])

  // Auto-dismiss error toast
  useEffect(() => {
    if (!aiError) return
    const timer = setTimeout(() => setAiError(null), 5000)
    return () => clearTimeout(timer)
  }, [aiError])

  // Auto-focus the "ask again" overlay so Space/Enter works immediately
  useEffect(() => {
    if (phase === 'answered') {
      const timer = setTimeout(() => askAgainRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [phase])

  return (
    <>
      <AnimatePresence mode="wait">
        {page === 'settings' ? (
          <SettingsPage key="settings" />
        ) : (
          <div
            key="main"
            style={{
              position: 'fixed',
              inset: 0,
              outline: 'none',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <AbstractBackground />
            <ParticleField />

            <PromptText visible={phase === 'asking'} isAIEnabled={isAIEnabled} />
            <QuestionInput
              visible={phase === 'asking'}
              onSubmit={handleQuestionSubmit}
            />

            <ContemplatingDisplay visible={phase === 'contemplating'} />

            <AnswerDisplay
              answer={currentAnswer}
              isVisible={phase === 'answered'}
            />

            {/* Full-screen clickable overlay for "ask again" — also active during contemplating */}
            {(phase === 'answered' || phase === 'contemplating') && (
              <div
                ref={askAgainRef}
                onClick={handleAskAgain}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    handleAskAgain()
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Press Space, Enter, or click anywhere to ask another question"
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 5,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              />
            )}

            {/* Live region for screen readers */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
              }}
            >
              {phase === 'contemplating' && 'The book is contemplating your question\u2026'}
              {phase === 'answered' && currentAnswer ? currentAnswer : ''}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Error toast */}
      {aiError && (
        <div
          role="alert"
          onClick={() => setAiError(null)}
          style={{
            position: 'fixed',
            bottom: 'clamp(3rem, 6vw, 4.5rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            maxWidth: 'min(400px, 85vw)',
            padding: '0.65rem 1.2rem',
            background: 'rgba(8, 13, 32, 0.92)',
            border: '1px solid rgba(240, 193, 75, 0.2)',
            borderRadius: '8px',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
            fontStyle: 'italic',
            color: 'var(--gold-dim)',
            textAlign: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'fade-in-toast 0.4s ease-out',
          }}
        >
          {aiError}
        </div>
      )}

      {/* Settings button — only show on main page */}
      {page === 'main' && (
        <SettingsButton isAIEnabled={isAIEnabled} />
      )}

      {/* GitHub link — only show on main page */}
      {page === 'main' && (
        <a
          href="https://github.com/ImHangLi/book-of-answers"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            bottom: 'clamp(1rem, 3vw, 1.5rem)',
            right: 'clamp(1rem, 3vw, 1.5rem)',
            zIndex: 200,
            color: '#b8923e',
            transition: 'color 0.3s ease, filter 0.3s ease',
            lineHeight: 0,
            filter: 'drop-shadow(0 0 4px rgba(240, 193, 75, 0.25))',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f0c14b'
            e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(240, 193, 75, 0.6))'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#b8923e'
            e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(240, 193, 75, 0.25))'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      )}
    </>
  )
}
