import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from 'react'
import { AnimatePresence } from 'framer-motion'
import QuestionInput from './components/QuestionInput'
import AnswerDisplay from './components/AnswerDisplay'
import HistoryList from './components/HistoryList'
import SettingsPage from './components/SettingsPage'
import { answers } from './data/answers'
import { useSettings } from './context/SettingsContext'
import { getAIAnswer, AIError } from './services/ai'

type Phase = 'asking' | 'contemplating' | 'answered'

interface HistoryItem {
  question: string
  answer: string
}

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
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const lastAnswerRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const { isAIEnabled, getAIConfig } = useSettings()

  const handleQuestionSubmit = useCallback(
    async (question: string) => {
      setCurrentQuestion(question)
      const config = getAIConfig()

      if (!config) {
        // Fallback: random answer
        const answer = getRandomAnswer(lastAnswerRef.current)
        lastAnswerRef.current = answer
        setCurrentAnswer(answer)
        setHistory((prev) => [{ question, answer }, ...prev])
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
          setHistory((prev) => [{ question, answer }, ...prev])
          setPhase('answered')
        }
      } catch (err) {
        clearTimeout(timeout)
        if (err instanceof Error && err.name === 'AbortError') {
          if (controller.signal.reason === 'timeout') {
            const fallback = getRandomAnswer(lastAnswerRef.current)
            lastAnswerRef.current = fallback
            setCurrentAnswer(fallback)
            setHistory((prev) => [{ question, answer: fallback }, ...prev])
            setPhase('answered')
            setAiError('The oracle took too long to respond. A random answer was chosen.')
          }
          return
        }

        const fallback = getRandomAnswer(lastAnswerRef.current)
        lastAnswerRef.current = fallback
        setCurrentAnswer(fallback)
        setHistory((prev) => [{ question, answer: fallback }, ...prev])
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
    setCurrentQuestion(null)
    setAiError(null)
  }, [])

  const handleHistoryClick = useCallback((item: HistoryItem) => {
    setCurrentAnswer(item.answer)
    setCurrentQuestion(item.question)
    setPhase('answered')
  }, [])

  // Auto-dismiss error toast
  useEffect(() => {
    if (!aiError) return
    const timer = setTimeout(() => setAiError(null), 5000)
    return () => clearTimeout(timer)
  }, [aiError])

  return (
    <>
      <AnimatePresence mode="wait">
        {page === 'settings' ? (
          <SettingsPage key="settings" />
        ) : (
          <div key="main" className="container">
            {/* Header */}
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '3rem',
              }}
            >
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  letterSpacing: '0.02em',
                }}
              >
                Book of Answers
              </h1>
              <a
                href="#settings"
                aria-label="Settings"
                style={{
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontSize: '1.4rem',
                  lineHeight: 1,
                  opacity: 0.5,
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
              >
                ☰
              </a>
            </header>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--line)', marginBottom: '3rem' }} />

            {/* Oracle section */}
            <section style={{ position: 'relative', minHeight: '300px' }}>
              <QuestionInput
                visible={phase === 'asking'}
                onSubmit={handleQuestionSubmit}
              />

              <AnswerDisplay
                answer={currentAnswer}
                question={currentQuestion}
                isVisible={phase === 'answered' || phase === 'contemplating'}
                isContemplating={phase === 'contemplating'}
                onAskAgain={handleAskAgain}
              />
            </section>

            {/* History */}
            <HistoryList
              items={history}
              onItemClick={handleHistoryClick}
            />

            {/* Footer */}
            <div
              style={{
                marginTop: '4rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {isAIEnabled ? 'Oracle mode' : 'Random mode'}
              </span>
              <a
                href="https://github.com/ImHangLi/book-of-answers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                style={{
                  color: 'var(--text)',
                  opacity: 0.3,
                  transition: 'opacity 0.3s ease',
                  lineHeight: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.3')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </AnimatePresence>

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
        {phase === 'contemplating' && 'The book is contemplating your question…'}
        {phase === 'answered' && currentAnswer ? currentAnswer : ''}
      </div>

      {/* Error toast */}
      {aiError && (
        <div
          role="alert"
          onClick={() => setAiError(null)}
          style={{
            position: 'fixed',
            bottom: 'clamp(1.5rem, 4vw, 2.5rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            maxWidth: 'min(400px, 85vw)',
            padding: '0.65rem 1.2rem',
            background: 'rgba(18, 18, 18, 0.9)',
            border: '1px solid rgba(18, 18, 18, 0.3)',
            borderRadius: '8px',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
            fontStyle: 'italic',
            color: '#f3f1f1',
            textAlign: 'center',
            cursor: 'pointer',
            animation: 'fade-in-toast 0.4s ease-out',
          }}
        >
          {aiError}
        </div>
      )}
    </>
  )
}
