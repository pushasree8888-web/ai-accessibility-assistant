import { Link } from 'react-router-dom'

export default function FeatureCard({ title, description, href, icon, id }) {
  return (
    <article className="feature-card" aria-labelledby={`feature-${id}-title`}>
      <Link className="feature-card__link" to={href}>
        <span className="feature-card__icon" aria-hidden="true">
          {icon}
        </span>
        <h3 id={`feature-${id}-title`} className="feature-card__title">
          {title}
        </h3>
        <p className="feature-card__description">{description}</p>
        <span className="feature-card__cta">Open assistant</span>
      </Link>
    </article>
  )
}
