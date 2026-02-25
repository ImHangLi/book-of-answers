import { motion } from 'framer-motion'

interface SettingsButtonProps {
  isAIEnabled: boolean
}

export default function SettingsButton({ isAIEnabled }: SettingsButtonProps) {
  return (
    <motion.a
      href="#settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      onClick={(e) => {
        e.stopPropagation()
      }}
      aria-label={isAIEnabled ? 'Settings — AI mode active' : 'Settings'}
      style={{
        position: 'fixed',
        bottom: 'clamp(1rem, 3vw, 1.5rem)',
        left: 'clamp(1rem, 3vw, 1.5rem)',
        zIndex: 200,
        padding: '6px',
        color: '#b8923e',
        lineHeight: 0,
        filter: 'drop-shadow(0 0 4px rgba(240, 193, 75, 0.25))',
        transition: 'color 0.3s ease, filter 0.3s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#f0c14b'
        e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(240, 193, 75, 0.6))'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#b8923e'
        e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(240, 193, 75, 0.25))'
      }}
      onFocus={(e) => {
        e.currentTarget.style.color = '#f0c14b'
        e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(240, 193, 75, 0.6))'
      }}
      onBlur={(e) => {
        e.currentTarget.style.color = '#b8923e'
        e.currentTarget.style.filter = 'drop-shadow(0 0 4px rgba(240, 193, 75, 0.25))'
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>

        {/* AI active indicator dot */}
        {isAIEnabled && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--gold-bright)',
              boxShadow: '0 0 6px rgba(240, 193, 75, 0.8)',
            }}
          />
        )}
      </div>
    </motion.a>
  )
}
