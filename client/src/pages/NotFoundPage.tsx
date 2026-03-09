import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { user, isGuest } = useAuth()

  const destination = user || isGuest ? '/dashboard' : '/'

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        background: 'var(--bg, #eef0f7)',
        color: 'var(--text, #1a1a24)',
        fontFamily: 'var(--font-main, sans-serif)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>404</span>
      <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text, #1a1a24)' }}>
        Page not found
      </h1>
      <p style={{ margin: 0, color: 'var(--text-3, #5f6279)', maxWidth: '26ch' }}>
        The URL you entered doesn't exist.
      </p>
      <button
        onClick={() => navigate(destination, { replace: true })}
        style={{
          padding: '0.5rem 1.25rem',
          borderRadius: 'var(--radius-md, 4px)',
          background: 'var(--accent, #6a5cf2)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 600,
          fontFamily: 'inherit',
        }}
      >
        {user || isGuest ? 'Go to Dashboard' : 'Go to Home'}
      </button>
    </div>
  )
}
