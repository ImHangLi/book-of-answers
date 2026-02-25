import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import AbstractBackground from './AbstractBackground'
import ParticleField from './ParticleField'

export default function SettingsPage() {
  const { apiKey, isAIEnabled, setProvider, setApiKey, clearApiKey } = useSettings()
  const [localKey, setLocalKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount (or nothing if already connected)
  useEffect(() => {
    if (!isAIEnabled) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200)
      return () => clearTimeout(timer)
    }
  }, [isAIEnabled])

  // Escape to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        window.location.hash = ''
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleConnect = useCallback(() => {
    const trimmed = localKey.trim()
    if (!trimmed) return

    // Auto-detect provider
    if (trimmed.startsWith('sk-ant-')) {
      setProvider('anthropic')
    } else {
      setProvider('openai')
    }

    setApiKey(trimmed)
    setLocalKey('')
    // Go back to main page after connecting
    window.location.hash = ''
  }, [localKey, setApiKey, setProvider])

  const handleDisconnect = useCallback(() => {
    clearApiKey()
  }, [clearApiKey])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleConnect()
      }
    },
    [handleConnect]
  )

  const providerLabel = apiKey.startsWith('sk-ant-') ? 'Anthropic' : 'OpenAI'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Shared background layers */}
      <AbstractBackground />
      <ParticleField />

      {/* Back link — top left */}
      <motion.a
        href="#"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onClick={(e) => {
          e.preventDefault()
          window.location.hash = ''
        }}
        style={{
          position: 'absolute',
          top: 'clamp(1.2rem, 3vw, 2rem)',
          left: 'clamp(1.2rem, 3vw, 2rem)',
          zIndex: 12,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
          fontStyle: 'italic',
          color: 'var(--gold-dim)',
          letterSpacing: '0.08em',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-bright)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gold-dim)')}
      >
        <span style={{ fontSize: '0.8em' }}>←</span> Return to the book
      </motion.a>

      {/* Central content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          zIndex: 11,
          textAlign: 'center',
          maxWidth: 'min(420px, 88vw)',
          width: '100%',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        }}
      >
        {/* Star ornament */}
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
            textShadow: [
              '0 0 8px rgba(240,193,75,0.3)',
              '0 0 20px rgba(240,193,75,0.6)',
              '0 0 8px rgba(240,193,75,0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            color: 'var(--gold-bright)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)',
          }}
        >
          ✦
        </motion.div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--cream)',
            letterSpacing: '0.04em',
            margin: '0 0 0.5rem',
          }}
        >
          {isAIEnabled ? 'The Oracle is Connected' : 'Awaken the Oracle'}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
            color: 'var(--cream-dim)',
            letterSpacing: '0.06em',
            margin: '0 0 clamp(1.5rem, 3vw, 2rem)',
            lineHeight: 1.6,
          }}
        >
          {isAIEnabled
            ? `Connected via ${providerLabel}`
            : 'Paste your OpenAI or Anthropic API key to receive answers guided by wisdom, not chance.'}
        </p>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(240, 193, 75, 0.2), transparent)',
            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        />

        {isAIEnabled ? (
          /* ---- Connected state ---- */
          <div>
            {/* Masked key display */}
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                color: 'var(--cream-dim)',
                letterSpacing: '0.12em',
                marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                wordBreak: 'break-all',
              }}
            >
              {showKey
                ? apiKey
                : `${apiKey.slice(0, 7)}${'•'.repeat(Math.min(apiKey.length - 11, 20))}${apiKey.slice(-4)}`}
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold-dim)',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  padding: '0 0 0 0.5rem',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  letterSpacing: '0.08em',
                  transition: 'color 0.2s ease',
                  verticalAlign: 'middle',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-bright)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gold-dim)')}
              >
                {showKey ? 'hide' : 'show'}
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '0.55rem 1.4rem',
                  border: '1px solid rgba(255, 100, 100, 0.2)',
                  borderRadius: '6px',
                  background: 'rgba(255, 80, 80, 0.06)',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                  fontStyle: 'italic',
                  color: 'rgba(255, 140, 140, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 80, 80, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255, 100, 100, 0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 80, 80, 0.06)'
                  e.currentTarget.style.borderColor = 'rgba(255, 100, 100, 0.2)'
                }}
              >
                Disconnect
              </button>
              <button
                onClick={() => (window.location.hash = '')}
                style={{
                  padding: '0.55rem 1.4rem',
                  border: '1px solid rgba(240, 193, 75, 0.2)',
                  borderRadius: '6px',
                  background: 'rgba(240, 193, 75, 0.06)',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                  fontStyle: 'italic',
                  color: 'var(--gold-mid)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(240, 193, 75, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(240, 193, 75, 0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(240, 193, 75, 0.06)'
                  e.currentTarget.style.borderColor = 'rgba(240, 193, 75, 0.2)'
                }}
              >
                Return
              </button>
            </div>
          </div>
        ) : (
          /* ---- Input state ---- */
          <div>
            <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <input
                ref={inputRef}
                type={showKey ? 'text' : 'password'}
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your API key here"
                autoComplete="off"
                spellCheck={false}
                aria-label="API key"
                style={{
                  width: '100%',
                  padding: '0.7rem 2.2rem 0.7rem 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(240, 193, 75, 0.25)',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                  fontStyle: 'italic',
                  color: 'var(--cream)',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  caretColor: 'var(--gold-bright)',
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(240, 193, 75, 0.45)')
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(240, 193, 75, 0.25)')
                }
              />
              {localKey && (
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? 'Hide API key' : 'Show API key'}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--cream-dim)',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    padding: '4px',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    letterSpacing: '0.06em',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cream-dim)')}
                >
                  {showKey ? 'hide' : 'show'}
                </button>
              )}
            </div>

            {/* Hint text */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.65rem, 1.3vw, 0.75rem)',
                color: 'var(--cream-dim)',
                letterSpacing: '0.08em',
                marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                fontStyle: 'italic',
              }}
            >
              {localKey.trim()
                ? 'Press Enter to connect'
                : 'Stored in this browser only. Never sent to our servers.'}
            </p>

            {/* Connect button */}
            <button
              onClick={handleConnect}
              disabled={!localKey.trim()}
              style={{
                padding: '0.55rem 2rem',
                border: `1px solid ${
                  localKey.trim()
                    ? 'rgba(240, 193, 75, 0.3)'
                    : 'rgba(255, 255, 255, 0.08)'
                }`,
                borderRadius: '6px',
                background: localKey.trim()
                  ? 'rgba(240, 193, 75, 0.08)'
                  : 'transparent',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                fontStyle: 'italic',
                color: localKey.trim() ? 'var(--gold-bright)' : 'var(--cream-dim)',
                cursor: localKey.trim() ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                letterSpacing: '0.06em',
              }}
              onMouseEnter={(e) => {
                if (localKey.trim()) {
                  e.currentTarget.style.background = 'rgba(240, 193, 75, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(240, 193, 75, 0.45)'
                }
              }}
              onMouseLeave={(e) => {
                if (localKey.trim()) {
                  e.currentTarget.style.background = 'rgba(240, 193, 75, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(240, 193, 75, 0.3)'
                }
              }}
            >
              Connect
            </button>
          </div>
        )}

        {/* Security notice */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)',
            color: 'var(--text-ghost)',
            letterSpacing: '0.06em',
            marginTop: 'clamp(1.5rem, 3vw, 2rem)',
            lineHeight: 1.5,
          }}
        >
          Key is sent directly to {isAIEnabled ? providerLabel : 'your chosen provider'} only.
        </p>
      </motion.div>
    </motion.div>
  )
}
