export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <p>
        AccessAI — AI Accessibility Assistant. Built to help everyone interact
        with the world.
      </p>
      <p className="site-footer__copy">© {year} AccessAI</p>
    </footer>
  )
}
