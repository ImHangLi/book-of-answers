import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePhraseIndex } from '../hooks/usePhraseIndex'

interface ContemplatingDisplayProps {
  visible: boolean
}

const phrases = [
  'The book is contemplating\u2026',
  'The pages are turning\u2026',
  'Seeking wisdom\u2026',
  'The oracle ponders\u2026',
]

export default function ContemplatingDisplay({ visible }: ContemplatingDisplayProps) {
  const phraseIndex = usePhraseIndex(visible, phrases.length, 2500)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 3,
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            gap: 'clamp(1rem, 2.5vw, 1.5rem)',
          }}
        >
          {/* Pulsing star */}
          <motion.span
            animate={{
              opacity: [0.4, 0.9, 0.4],
              textShadow: [
                '0 0 8px rgba(240,193,75,0.2)',
                '0 0 24px rgba(240,193,75,0.6)',
                '0 0 8px rgba(240,193,75,0.2)',
              ],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              color: 'var(--gold-bright)',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              willChange: 'opacity, transform',
            }}
          >
            ✦
          </motion.span>

          {/* Cycling phrases */}
          <div
            style={{
              height: 'clamp(1.5rem, 3vw, 2rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.75, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--cream-dim)',
                  letterSpacing: '0.1em',
                  textAlign: 'center',
                }}
              >
                {phrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Decorative lines */}
          <motion.div
            animate={{
              opacity: [0.25, 0.5, 0.25],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              height: '1px',
              width: 'clamp(40px, 10vw, 70px)',
              background:
                'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
