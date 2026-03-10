import { motion } from 'framer-motion'

interface HistoryItem {
  question: string
  answer: string
}

interface HistoryListProps {
  items: HistoryItem[]
  onItemClick: (item: HistoryItem) => void
}

export default function HistoryList({ items, onItemClick }: HistoryListProps) {
  if (items.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ marginTop: '4rem' }}
    >
      {/* Section label */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
          fontWeight: 400,
          color: 'var(--text-mid)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}
      >
        The Ledger of Inquiries
      </p>

      {/* List */}
      <div style={{ borderTop: '1px solid var(--line)' }}>
        {items.map((item, index) => (
          <motion.button
            key={`history-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index === 0 ? 0.2 : 0,
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onClick={() => onItemClick(item)}
            aria-label={`View answer for: ${item.question}`}
            className="hover-opacity-dim"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              minHeight: '44px',
              padding: '0.9rem 0',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--line)',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--text)',
              letterSpacing: '0.02em',
            }}
          >
            <span>{item.question}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginLeft: '1rem', opacity: 0.4 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}
