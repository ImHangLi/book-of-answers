import { motion, AnimatePresence } from 'framer-motion'

interface AnswerDisplayProps {
  answer: string | null
  question: string | null
  isVisible: boolean
  isContemplating: boolean
  onAskAgain: () => void
}

export default function AnswerDisplay({
  answer,
  question,
  isVisible,
  isContemplating,
  onAskAgain,
}: AnswerDisplayProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={isContemplating ? 'contemplating' : answer}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{
            opacity: 0,
            filter: 'blur(8px)',
            transition: { duration: 0.4, ease: [0.4, 0, 1, 1] },
          }}
          transition={{
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
            filter: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
          }}
          style={{
            textAlign: 'center',
            padding: '2rem 0',
          }}
        >
          {isContemplating ? (
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-mid)',
                letterSpacing: '0.04em',
              }}
            >
              The book contemplates…
            </motion.p>
          ) : (
            <>
              {/* The question echo */}
              {question && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(0.8rem, 1.6vw, 0.95rem)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'var(--text)',
                    letterSpacing: '0.06em',
                    marginBottom: '2rem',
                  }}
                >
                  {question}
                </motion.p>
              )}

              {/* The answer */}
              <motion.p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  lineHeight: 1.2,
                  color: 'var(--text)',
                  letterSpacing: '-0.01em',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {answer}
              </motion.p>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '1px',
                  width: '60px',
                  background: 'var(--line)',
                  margin: '2rem auto',
                }}
              />

              {/* Ask Again button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={onAskAgain}
                className="hover-fill"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  letterSpacing: '0.08em',
                  background: 'transparent',
                  border: '1px solid var(--text)',
                  borderRadius: '50px',
                  padding: '0.5rem 1.8rem',
                  cursor: 'pointer',
                }}
              >
                Ask Again
              </motion.button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
