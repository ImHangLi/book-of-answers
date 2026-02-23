import { motion, AnimatePresence } from 'framer-motion'

interface PromptTextProps {
  visible: boolean
}

export default function PromptText({ visible }: PromptTextProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '22%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 2,
            padding: '2rem',
          }}
        >
          {/* Ornamental star */}
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.15, 1],
              textShadow: [
                '0 0 10px rgba(240,193,75,0.3)',
                '0 0 30px rgba(240,193,75,0.6)',
                '0 0 10px rgba(240,193,75,0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              color: 'var(--gold-bright)',
              marginBottom: '2.5rem',
              filter: 'drop-shadow(0 0 8px rgba(240,193,75,0.4))',
            }}
          >
            ✦
          </motion.div>

          {/* Main prompt */}
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--cream-soft)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
              textShadow: '0 0 30px rgba(240,193,75,0.15)',
            }}
          >
            Focus on your question
          </motion.p>

          {/* Decorative line */}
          <motion.div
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scaleX: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
              marginTop: '1rem',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
