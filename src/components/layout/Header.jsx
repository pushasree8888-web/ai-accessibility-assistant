import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  return (
    <header className="site-header" role="banner">
      <div className="site-header__brand-area">
        <Link to="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden="true">
            ♿
          </span>
          <span>AccessAI</span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <Link to="/vision">Vision</Link>
          <Link to="/hearing">Hearing</Link>
          <Link to="/communication">Communication</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button
                type="button"
                className="site-nav__logout"
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}


