import LargeButton from '../components/ui/LargeButton'

export default function AssistantPageLayout({
  title,
  description,
  actionLabel,
  onActionClick,
  actionDisabled = false,
  children,
}) {
  const headingId = 'assistant-page-title'

  return (
    <section className="assistant-page" aria-labelledby={headingId}>
      <h1 id={headingId}>{title}</h1>
      <p className="assistant-page__description">{description}</p>
      <LargeButton
        onClick={onActionClick}
        disabled={actionDisabled}
        ariaLabel={actionLabel}
      >
        {actionLabel}
      </LargeButton>
      {children}
    </section>
  )
}
