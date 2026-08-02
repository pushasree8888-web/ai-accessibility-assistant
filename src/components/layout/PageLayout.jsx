import Header from './Header'
import Footer from './Footer'

export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  )
}
