import { Link } from 'react-router-dom'

export default function Header() {
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
        </nav>
      </div>
    </header>
  )
}
