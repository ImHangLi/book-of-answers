import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuestionInputProps {
  visible: boolean
  onSubmit: (question: string) => void
}

export default function QuestionInput({ visible, onSubmit }: QuestionInputProps) {
  const [question, setQuestion] = useState('')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => inputRef.current?.focus(), 600)
      return () => clearTimeout(timer)
    }
  }, [visible])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!question.trim()) {
        setShake(true)
        setTimeout(() => setShake(false), 500)
        inputRef.current?.focus()
        return
      }
      onSubmit(question)
      setQuestion('')
    },
    [question, onSubmit]
  )

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Inscribe your inquiry..."
              autoComplete="off"
              aria-label="Type your question"
              style={{
                animation: shake ? 'shake 0.4s ease-in-out' : undefined,
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--text)',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text)',
                textAlign: 'left',
                padding: '0.5rem 0',
                outline: 'none',
                caretColor: 'var(--text)',
                letterSpacing: '0.01em',
              }}
            />

            {/* Submit hint */}
            <motion.p
              animate={{
                opacity: question.trim().length > 0 ? 0.4 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '0.75rem',
              }}
            >
              Press return to seek
            </motion.p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
