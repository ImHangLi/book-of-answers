import { motion, AnimatePresence } from 'framer-motion'

interface AnswerDisplayProps {
  answer: string | null
  isVisible: boolean
}

export default function AnswerDisplay({ answer, isVisible }: AnswerDisplayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 3,
        padding: '2rem',
      }}
    >
      <AnimatePresence mode="wait">
        {isVisible && answer && (
          <motion.div
            key={answer}
            initial={{
              opacity: 0,
              filter: 'blur(24px)',
              scale: 0.85,
            }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              scale: 1,
            }}
            exit={{
              opacity: 0,
              filter: 'blur(16px)',
              scale: 1.08,
              transition: {
                duration: 0.7,
                ease: 'easeIn',
              },
            }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
              filter: { duration: 1.6, ease: 'easeOut' },
              scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{
              textAlign: 'center',
              maxWidth: '650px',
              width: '100%',
            }}
          >
            {/* Top ornament */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <motion.div
                style={{
                  height: '1px',
                  width: '50px',
                  background: 'linear-gradient(90deg, transparent, var(--gold-mid))',
                }}
              />
              <motion.span
                animate={{
                  opacity: [0.4, 0.9, 0.4],
                  textShadow: [
                    '0 0 8px rgba(240,193,75,0.3)',
                    '0 0 20px rgba(240,193,75,0.7)',
                    '0 0 8px rgba(240,193,75,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  color: 'var(--gold-bright)',
                  fontSize: '0.9rem',
                }}
              >
                ✦
              </motion.span>
              <motion.div
                style={{
                  height: '1px',
                  width: '50px',
                  background: 'linear-gradient(90deg, var(--gold-mid), transparent)',
                }}
              />
            </motion.div>

            {/* The answer */}
            <motion.p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: 'var(--cream)',
                textShadow: `
                  0 0 40px rgba(240, 193, 75, 0.25),
                  0 0 80px rgba(240, 193, 75, 0.1),
                  0 2px 4px rgba(0, 0, 0, 0.5)
                `,
                letterSpacing: '-0.01em',
              }}
            >
              {answer}
            </motion.p>

            {/* Bottom ornamental line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: 1,
                scaleX: 1,
              }}
              transition={{
                delay: 0.8,
                duration: 0.7,
                ease: 'easeOut',
              }}
              style={{
                height: '1px',
                width: '80px',
                background: 'linear-gradient(90deg, transparent, var(--gold-bright), transparent)',
                margin: '2rem auto 0',
                filter: 'drop-shadow(0 0 8px rgba(240, 193, 75, 0.4))',
              }}
            />

            {/* "Ask again" hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-ghost)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '1.5rem',
              }}
            >
              Press Space or click anywhere to ask again
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
