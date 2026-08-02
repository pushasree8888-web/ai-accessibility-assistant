import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LANGUAGES, useLanguage } from '../../context/LanguageContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { selectedLanguage, changeLanguage } = useLanguage()
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

          <label htmlFor="language-select" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
            Choose language
          </label>
          <select
            id="language-select"
            value={selectedLanguage.code}
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label="Select Assistant Language"
            style={{
              borderRadius: '0.5rem',
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-h)',
              padding: '0.35rem 0.6rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          {user ? (
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
