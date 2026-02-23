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
        padding: 'clamp(1.25rem, 4vw, 2rem)',
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
                duration: 0.5,
                ease: [0.4, 0, 1, 1],
              },
            }}
            transition={{
              duration: 2.0,
              ease: [0.16, 1, 0.3, 1],
              filter: { duration: 2.4, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{
              textAlign: 'center',
              maxWidth: 'min(650px, 90vw)',
              width: '100%',
              willChange: 'opacity, filter, transform',
            }}
          >
            {/* Top ornament */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(0.5rem, 2vw, 1rem)',
                marginBottom: 'clamp(1.2rem, 3vw, 2rem)',
              }}
            >
              <motion.div
                style={{
                  height: '1px',
                  width: 'clamp(30px, 8vw, 50px)',
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
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  willChange: 'opacity',
                }}
              >
                ✦
              </motion.span>
              <motion.div
                style={{
                  height: '1px',
                  width: 'clamp(30px, 8vw, 50px)',
                  background: 'linear-gradient(90deg, var(--gold-mid), transparent)',
                }}
              />
            </motion.div>

            {/* The answer */}
            <motion.p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(1.8rem, 5.5vw, 4rem)',
                fontWeight: 500,
                lineHeight: 1.2,
                color: 'var(--cream)',
                textShadow: `
                  0 0 40px rgba(240, 193, 75, 0.25),
                  0 0 80px rgba(240, 193, 75, 0.1),
                  0 2px 4px rgba(0, 0, 0, 0.5)
                `,
                letterSpacing: '-0.01em',
                padding: '0 0.5rem',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
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
                delay: 1.2,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                height: '1px',
                width: 'clamp(50px, 12vw, 80px)',
                background: 'linear-gradient(90deg, transparent, var(--gold-bright), transparent)',
                margin: 'clamp(1.2rem, 3vw, 2rem) auto 0',
                filter: 'drop-shadow(0 0 8px rgba(240, 193, 75, 0.4))',
              }}
            />

            {/* "Ask again" hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.65rem, 1.4vw, 0.85rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-ghost)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: 'clamp(1rem, 2.5vw, 1.5rem)',
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
