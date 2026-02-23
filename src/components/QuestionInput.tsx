import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionInputProps {
  visible: boolean
  onSubmit: (question: string) => void
}

export default function QuestionInput({ visible, onSubmit }: QuestionInputProps) {
  const [question, setQuestion] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => inputRef.current?.focus(), 800)
      return () => clearTimeout(timer)
    }
  }, [visible])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!question.trim()) return
      onSubmit(question)
      setQuestion('')
    },
    [question, onSubmit]
  )

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4,
            padding: '2rem',
            marginTop: '4vh',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '520px',
            }}
          >
            {/* Naked input — the typography IS the interface */}
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question..."
              autoComplete="off"
              aria-label="Type your question"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--cream)',
                textAlign: 'center',
                padding: '0.8rem 0',
                outline: 'none',
                caretColor: 'var(--gold-bright)',
                letterSpacing: '0.02em',
              }}
            />

            {/* Single gold line — the only visual anchor */}
            <motion.div
              animate={{
                opacity: question.length > 0 ? 1 : 0.25,
                scaleX: question.length > 0 ? 1 : 0.4,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: question.length > 0 ? '280px' : '120px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--gold-bright), transparent)',
                transformOrigin: 'center',
                filter: question.length > 0
                  ? 'drop-shadow(0 0 8px rgba(240, 193, 75, 0.5))'
                  : 'none',
                transition: 'max-width 0.6s ease-out',
              }}
            />

            {/* Submit hint */}
            <div style={{ height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.p
                animate={{
                  opacity: question.trim().length > 0 ? 0.7 : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--gold-dim)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Press Enter to receive your answer
              </motion.p>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
