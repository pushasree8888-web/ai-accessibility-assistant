import LargeButton from '../ui/LargeButton'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__eyebrow">AI Accessibility Assistant</p>
      <h1 id="hero-title">AccessAI</h1>
      <p className="hero__tagline">
        Tools for vision, hearing, and speech—designed to be simple and
        accessible.
      </p>
      <LargeButton href="#features" ariaLabel="Jump to feature assistants">
        Choose an assistant
      </LargeButton>
    </section>
  )
}
