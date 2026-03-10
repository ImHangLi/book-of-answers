import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'

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

    if (trimmed.startsWith('sk-ant-')) {
      setProvider('anthropic')
    } else {
      setProvider('openai')
    }

    setApiKey(trimmed)
    setLocalKey('')
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
      className="container"
      style={{ paddingTop: '1rem' }}
    >
      {/* Back link */}
      <motion.a
        href="#"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onClick={(e) => {
          e.preventDefault()
          window.location.hash = ''
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
          fontStyle: 'italic',
          color: 'var(--text-mid)',
          letterSpacing: '0.06em',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          marginBottom: '3rem',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mid)')}
      >
        <span style={{ fontSize: '0.8em' }}>←</span> Return to the book
      </motion.a>

      {/* Central content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '420px' }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text)',
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
            color: 'var(--text-mid)',
            letterSpacing: '0.04em',
            margin: '0 0 2rem',
            lineHeight: 1.6,
          }}
        >
          {isAIEnabled
            ? `Connected via ${providerLabel}`
            : 'Paste your OpenAI or Anthropic API key to receive answers guided by wisdom, not chance.'}
        </p>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--line)', marginBottom: '2rem' }} />

        {isAIEnabled ? (
          /* ---- Connected state ---- */
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                color: 'var(--text-mid)',
                letterSpacing: '0.08em',
                marginBottom: '2rem',
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
                  color: 'var(--text-mid)',
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  padding: '0 0 0 0.5rem',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  letterSpacing: '0.06em',
                  transition: 'color 0.2s ease',
                  verticalAlign: 'middle',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mid)')}
              >
                {showKey ? 'hide' : 'show'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleDisconnect}
                style={{
                  padding: '0.5rem 1.4rem',
                  border: '1px solid rgba(180, 60, 60, 0.3)',
                  borderRadius: '50px',
                  background: 'transparent',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                  fontStyle: 'italic',
                  color: 'rgba(180, 60, 60, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(180, 60, 60, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(180, 60, 60, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(180, 60, 60, 0.3)'
                }}
              >
                Disconnect
              </button>
              <button
                onClick={() => (window.location.hash = '')}
                style={{
                  padding: '0.5rem 1.4rem',
                  border: '1px solid var(--text)',
                  borderRadius: '50px',
                  background: 'transparent',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--text)'
                  e.currentTarget.style.color = 'var(--bg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text)'
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
                  borderBottom: '1px solid var(--line)',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                  fontStyle: 'italic',
                  color: 'var(--text)',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  caretColor: 'var(--text)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--text)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
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
                    color: 'var(--text-mid)',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    padding: '4px',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    letterSpacing: '0.06em',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mid)')}
                >
                  {showKey ? 'hide' : 'show'}
                </button>
              )}
            </div>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.65rem, 1.3vw, 0.75rem)',
                color: 'var(--text-dim)',
                letterSpacing: '0.06em',
                marginBottom: '2rem',
                fontStyle: 'italic',
              }}
            >
              {localKey.trim()
                ? 'Press Enter to connect'
                : 'Stored in this browser only. Never sent to our servers.'}
            </p>

            <button
              onClick={handleConnect}
              disabled={!localKey.trim()}
              style={{
                padding: '0.5rem 1.8rem',
                border: `1px solid ${localKey.trim() ? 'var(--text)' : 'var(--line)'}`,
                borderRadius: '50px',
                background: 'transparent',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)',
                fontStyle: 'italic',
                color: localKey.trim() ? 'var(--text)' : 'var(--text-dim)',
                cursor: localKey.trim() ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                letterSpacing: '0.06em',
              }}
              onMouseEnter={(e) => {
                if (localKey.trim()) {
                  e.currentTarget.style.background = 'var(--text)'
                  e.currentTarget.style.color = 'var(--bg)'
                }
              }}
              onMouseLeave={(e) => {
                if (localKey.trim()) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
            >
              Connect
            </button>
          </div>
        )}

        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)',
            color: 'var(--text-dim)',
            letterSpacing: '0.06em',
            marginTop: '2rem',
            lineHeight: 1.5,
          }}
        >
          Key is sent directly to {isAIEnabled ? providerLabel : 'your chosen provider'} only.
        </p>
      </motion.div>
    </motion.div>
  )
}
