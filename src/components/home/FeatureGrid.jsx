import FeatureCard from '../ui/FeatureCard'

export default function FeatureGrid({ features }) {
  return (
    <section
      id="features"
      className="feature-grid"
      aria-labelledby="features-heading"
    >
      <h2 id="features-heading" className="feature-grid__heading">
        Choose your assistant
      </h2>
      <ul className="feature-grid__list">
        {features.map((feature) => (
          <li key={feature.id}>
            <FeatureCard {...feature} />
          </li>
        ))}
      </ul>
    </section>
  )
}
