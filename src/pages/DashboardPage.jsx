import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('[DashboardPage] Logout error:', err)
    }
  }

  return (
    <section className="assistant-page assistant-card assistant-card--centered" aria-labelledby="dashboard-title">
      <p className="auth-card__eyebrow">Protected area</p>
      <h1 id="dashboard-title">Your dashboard</h1>
      <p className="assistant-page__description">
        This area is only available after authentication. Your session is currently active.
      </p>
      <p className="assistant-page__description">
        Signed in as <strong>{user?.email || 'your account'}</strong>
      </p>
      <button type="button" className="large-button" onClick={handleLogout}>
        Log out
      </button>
    </section>
  )
}
