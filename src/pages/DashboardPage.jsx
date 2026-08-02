import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { features } from '../data/features'
import FeatureGrid from '../components/home/FeatureGrid'

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
    <div className="dashboard-layout" style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <section
        className="assistant-card"
        style={{
          width: '100%',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
        aria-labelledby="dashboard-title"
      >
        <div>
          <p className="auth-card__eyebrow">Active Experience</p>
          <h1 id="dashboard-title" style={{ margin: '0.25rem 0 0.5rem' }}>
            Welcome to your Dashboard
          </h1>
          <p className="assistant-page__description" style={{ margin: 0, textAlign: 'left' }}>
            Signed in as <strong>{user?.email || 'your account'}</strong>
          </p>
        </div>
        <button type="button" className="large-button" onClick={handleLogout}>
          Log out
        </button>
      </section>

      <section aria-labelledby="accessibility-tools-heading">
        <h2 id="accessibility-tools-heading" className="feature-grid__heading" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          Your AI Accessibility Tools
        </h2>
        <FeatureGrid features={features} />
      </section>
    </div>
  )
}
