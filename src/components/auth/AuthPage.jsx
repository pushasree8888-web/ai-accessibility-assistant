import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getFriendlyAuthError } from '../../utils/authError'
import { isValidEmail, isValidPassword } from '../../utils/authValidation'

export default function AuthPage({ initialMode }) {
  const { user, login, signup, loginWithGoogle, resendConfirmationEmail, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const defaultMode = initialMode || (location.pathname === '/signup' ? 'signup' : 'login')
  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const from = useMemo(() => location.state?.from?.pathname || '/dashboard', [location.state])

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode)
    } else if (location.pathname === '/signup') {
      setMode('signup')
    } else if (location.pathname === '/login') {
      setMode('login')
    }
  }, [location.pathname, initialMode])

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, from])

  const handleModeSwitch = (newMode) => {
    setMode(newMode)
    setError('')
    setSuccess('')
    navigate(newMode === 'signup' ? '/signup' : '/login', { replace: true })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cleanEmail = email.trim()
    console.info('[AuthPage] Form submitted', { mode, email: cleanEmail })
    setError('')
    setSuccess('')

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters long.')
      return
    }

    try {
      setIsSubmitting(true)
      if (mode === 'signup') {
        const result = await signup(cleanEmail, password)
        if (result?.user && !result?.session) {
          setSuccess('Account created successfully! Please check your email inbox to confirm your account.')
        } else {
          setSuccess('Account created successfully! Redirecting...')
          setTimeout(() => navigate(from, { replace: true }), 500)
        }
      } else {
        await login(cleanEmail, password)
        navigate(from, { replace: true })
      }
    } catch (authError) {
      console.error('[AuthPage] Authentication error', authError)
      if (authError?.message?.toLowerCase().includes('email not confirmed')) {
        resendConfirmationEmail(cleanEmail).catch(() => {})
      }
      setError(getFriendlyAuthError(authError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    console.info('[AuthPage] Google sign-in requested')
    setError('')
    setSuccess('')
    try {
      setIsSubmitting(true)
      await loginWithGoogle()
    } catch (authError) {
      console.error('[AuthPage] Google sign-in error', authError)
      setError(getFriendlyAuthError(authError))
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setError('Please enter your email address to resend the confirmation email.')
      return
    }
    try {
      setIsResending(true)
      await resendConfirmationEmail(cleanEmail)
      setSuccess('Confirmation email resent! Please check your inbox.')
      setError('')
    } catch (err) {
      console.error('[AuthPage] Resend confirmation error', err)
      setError(getFriendlyAuthError(err))
    } finally {
      setIsResending(false)
    }
  }

  if (loading) {
    return (
      <div className="auth-status" aria-live="polite">
        Preparing your experience…
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="auth-card">
        <p className="auth-card__eyebrow">Secure access</p>
        <h1 id="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-card__text">
          {mode === 'login'
            ? 'Sign in to continue to your accessibility dashboard.'
            : 'Join AccessAI and keep your saved experience secure.'}
        </p>

        <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={`auth-toggle__button ${mode === 'login' ? 'is-active' : ''}`}
            onClick={() => handleModeSwitch('login')}
            role="tab"
            aria-selected={mode === 'login'}
            id="tab-login"
            aria-controls="panel-auth"
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-toggle__button ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => handleModeSwitch('signup')}
            role="tab"
            aria-selected={mode === 'signup'}
            id="tab-signup"
            aria-controls="panel-auth"
          >
            Sign Up
          </button>
        </div>

        <div id="panel-auth" role="tabpanel" aria-labelledby={mode === 'login' ? 'tab-login' : 'tab-signup'}>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-field" htmlFor="email">
              <span>Email</span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="name@example.com"
                aria-required="true"
              />
            </label>

            <label className="auth-field" htmlFor="password">
              <span>Password</span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="At least 8 characters"
                aria-required="true"
              />
            </label>

            {error ? (
              <div className="auth-error" role="alert" aria-live="assertive">
                <p style={{ margin: 0 }}>{error}</p>
                {error.toLowerCase().includes('not confirmed') ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    style={{
                      marginTop: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    {isResending ? 'Resending email…' : 'Resend confirmation email'}
                  </button>
                ) : null}
              </div>
            ) : null}

            {success ? (
              <p
                className="auth-success"
                role="status"
                aria-live="polite"
                style={{
                  margin: 0,
                  padding: '0.85rem 0.95rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#065f46',
                  fontWeight: 600,
                }}
              >
                {success}
              </p>
            ) : null}

            <button type="submit" className="large-button auth-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <div className="auth-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <button
            type="button"
            className="auth-google"
            onClick={handleGoogle}
            disabled={isSubmitting}
            aria-label="Continue with Google Authentication"
          >
            {isSubmitting ? 'Working…' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </section>
  )
}
