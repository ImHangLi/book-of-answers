import { useState, useCallback, useRef, useEffect } from 'react'
import AbstractBackground from './components/AbstractBackground'
import ParticleField from './components/ParticleField'
import PromptText from './components/PromptText'
import QuestionInput from './components/QuestionInput'
import AnswerDisplay from './components/AnswerDisplay'
import { answers } from './data/answers'

type Phase = 'asking' | 'answered'

function getRandomAnswer(exclude: string | null): string {
  let answer: string
  do {
    answer = answers[Math.floor(Math.random() * answers.length)]
  } while (answer === exclude && answers.length > 1)
  return answer
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('asking')
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null)
  const lastAnswerRef = useRef<string | null>(null)
  const askAgainRef = useRef<HTMLDivElement>(null)

  const handleQuestionSubmit = useCallback((_question: string) => {
    const answer = getRandomAnswer(lastAnswerRef.current)
    lastAnswerRef.current = answer
    setCurrentAnswer(answer)
    setPhase('answered')
  }, [])

  const handleAskAgain = useCallback(() => {
    setPhase('asking')
    setCurrentAnswer(null)
  }, [])

  // Auto-focus the "ask again" overlay so Space/Enter works immediately
  useEffect(() => {
    if (phase === 'answered') {
      // Small delay to let the answer animate in, then grab focus
      const timer = setTimeout(() => askAgainRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [phase])

  return (
    <div
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

      <PromptText visible={phase === 'asking'} />
      <QuestionInput
        visible={phase === 'asking'}
        onSubmit={handleQuestionSubmit}
      />

      <AnswerDisplay
        answer={currentAnswer}
        isVisible={phase === 'answered'}
      />

      {/* Full-screen clickable overlay for "ask again" — auto-focused for keyboard */}
      {phase === 'answered' && (
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
        {phase === 'answered' && currentAnswer ? currentAnswer : ''}
      </div>
    </div>
  )
}
