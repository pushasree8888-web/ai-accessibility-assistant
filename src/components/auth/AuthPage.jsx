import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getFriendlyAuthError } from '../../utils/authError'
import { isValidEmail, isValidPassword } from '../../utils/authValidation'

export default function AuthPage() {
  const { currentUser, login, signup, loginWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const from = useMemo(() => location.state?.from?.pathname || '/dashboard', [location.state])

  useEffect(() => {
    if (!loading && currentUser) {
      navigate(from, { replace: true })
    }
  }, [currentUser, loading, navigate, from])

  const handleModeSwitch = (newMode) => {
    setMode(newMode)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cleanEmail = email.trim()
    console.info('[AuthPage] Form submitted', { mode, email: cleanEmail })
    setError('')

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
        await signup(cleanEmail, password)
      } else {
        await login(cleanEmail, password)
      }
      navigate(from, { replace: true })
    } catch (authError) {
      console.error('[AuthPage] Authentication error', authError)
      setError(getFriendlyAuthError(authError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    console.info('[AuthPage] Google sign-in requested')
    setError('')
    try {
      setIsSubmitting(true)
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (authError) {
      console.error('[AuthPage] Google sign-in error', authError)
      setError(getFriendlyAuthError(authError))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="auth-status">Preparing your experience…</div>
  }

  if (currentUser) {
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
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-toggle__button ${mode === 'signup' ? 'is-active' : ''}`}
            onClick={() => handleModeSwitch('signup')}
            role="tab"
            aria-selected={mode === 'signup'}
          >
            Sign Up
          </button>
        </div>

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
            />
          </label>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <button type="submit" className="large-button auth-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">
          <span>or</span>
        </div>

        <button type="button" className="auth-google" onClick={handleGoogle} disabled={isSubmitting}>
          {isSubmitting ? 'Working…' : 'Continue with Google'}
        </button>
      </div>
    </section>
  )
}

