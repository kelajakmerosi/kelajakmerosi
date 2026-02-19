import { useState } from 'react'
import { useAuth }  from '../hooks/useAuth'
import { useLang }  from '../hooks'
import { Input }    from '../components/ui/Input'
import { Button }   from '../components/ui/Button'
import { GlassCard }from '../components/ui/GlassCard'
import { Alert, Tabs } from '../components/ui/index'
import styles from './AuthPage.module.css'

function GoogleSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  )
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

export function AuthPage() {
  const { t } = useLang()
  const { login, register, loginWithGoogle, continueAsGuest } = useAuth()

  const [mode,    setMode]    = useState<'login' | 'register'>('login')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [gLoading,setGLoading]= useState(false)
  const [form,    setForm]    = useState({ email:'', password:'', name:'', confirm:'' })

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError(t('googleLoginUnavailable'))
      return
    }

    // Fallback: open standard OAuth2 popup (works once localhost:5173 is registered
    // as an Authorized redirect URI in Google Cloud Console)
    const nonce = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
    const params = new URLSearchParams({
      client_id:     GOOGLE_CLIENT_ID,
      redirect_uri:  window.location.origin,
      response_type: 'id_token',
      scope:         'openid email profile',
      nonce,
    })

    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'google-oauth',
      'width=500,height=620,top=100,left=100,resizable=yes,scrollbars=yes'
    )

    if (!popup) {
      setError(t('popupBlocked'))
      return
    }

    setGLoading(true)

    const timer = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(timer)
          setGLoading(false)
          return
        }
        const hash = popup.location.hash
        if (hash?.includes('id_token=')) {
          const token = new URLSearchParams(hash.slice(1)).get('id_token')
          popup.close()
          clearInterval(timer)
          if (token) {
            loginWithGoogle(token)
              .catch(e => {
                const msg = e instanceof Error ? e.message : ''
                setError(t(msg) !== msg ? t(msg) : t('googleLoginFailed'))
              })
              .finally(() => setGLoading(false))
          } else {
            setError(t('googleLoginFailed'))
            setGLoading(false)
          }
        }
      } catch {
        // Still on Google's domain — cross-origin, keep polling
      }
    }, 300)

    // Auto-close after 3 min
    setTimeout(() => {
      clearInterval(timer)
      try { if (!popup.closed) popup.close() } catch {}
      setGLoading(false)
    }, 180_000)
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) return
    if (mode === 'register' && form.password !== form.confirm) {
      setError(t('passwordMismatch')); return
    }
    setLoading(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form.name || form.email.split('@')[0], form.email, form.password)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'error'
      if (msg.toLowerCase().includes('networkerror')) {
        setError(t('networkError'))
      } else {
        setError(t(msg) !== msg ? t(msg) : msg)
      }
    }
    setLoading(false)
  }

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div className={styles.page}>
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <GlassCard className={`${styles.card} fade-in`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoWrap}>
            {/* <div className={styles.logoIcon}>E</div> */}
          </div>
          <span className="logo-text" style={{ fontSize: 30 }}>KelajakMerosi</span>
          <p className={styles.tagline}>{t('tagline')}</p>
        </div>

        {/* Mode tabs */}
        <Tabs
          tabs={[{ id:'login', label: t('login') }, { id:'register', label: t('register') }]}
          active={mode}
          onChange={id => { setMode(id as typeof mode); setError('') }}
        />

        {/* Form */}
        <div className={styles.form}>
          {mode === 'register' && (
            <Input placeholder={t('name')} value={form.name}
              onChange={set('name')} onKeyDown={onKey} />
          )}
          <Input placeholder={t('email')} value={form.email}
            onChange={set('email')} onKeyDown={onKey} error={!!error} />
          <Input type="password" placeholder={t('password')} value={form.password}
            onChange={set('password')} onKeyDown={onKey} error={!!error} />
          {mode === 'register' && (
            <Input type="password" placeholder={t('confirmPassword')} value={form.confirm}
              onChange={set('confirm')} onKeyDown={onKey} error={!!error} />
          )}
  
          {error && <Alert variant="error">{error}</Alert>}

          <Button fullWidth size="lg" onClick={handleSubmit} disabled={loading}>
            {loading
              ? (
                <span className={styles.loadingInline}>
                  <span className={styles.spinner} aria-hidden="true" />
                  {t('authLoading')}
                </span>
              )
              : mode === 'login' ? t('login') : t('createAccount')}
          </Button>

          <div className={styles.orRow}>
            <span className={styles.orLine} />
            <span className={styles.orText}>{t('orContinueWith')}</span>
            <span className={styles.orLine} />
          </div>

          {/* Custom translated Google button */}
          <div className={styles.googleWrap}>
            <Button
              variant="ghost"
              fullWidth
              className={styles.googleFallbackBtn}
              onClick={handleGoogleLogin}
              disabled={gLoading}
            >
              {gLoading
                ? (
                  <span className={styles.loadingInline}>
                    <span className={styles.spinner} aria-hidden="true" />
                    {t('googleLoading')}
                  </span>
                )
                : (
                  <>
                    <GoogleSVG />
                    {t('loginWithGoogle')}
                  </>
                )}
            </Button>
          </div>

          <Button variant="ghost" fullWidth onClick={continueAsGuest}>
            {t('guestMode')}
          </Button>
        </div>

        {/* Switch mode link */}
        <p className={styles.switchNote}>
          {mode === 'login' ? t('noAccount') : t('haveAccount')}{' '}
          <button className={styles.switchLink}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? t('register') : t('login')}
          </button>
        </p>
      </GlassCard>
    </div>
  )
}
