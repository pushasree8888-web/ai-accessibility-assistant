/**
 * Large, easy-to-tap control for primary actions.
 * Pass `href` for a link, or omit it for a button with `onClick`.
 */
export default function LargeButton({
  children,
  onClick,
  href,
  className = '',
  ariaLabel,
  disabled = false,
}) {
  const classes = `large-button ${className}`.trim()
  const labelProps = ariaLabel ? { 'aria-label': ariaLabel } : {}

  if (href) {
    return (
      <a className={classes} href={href} {...labelProps}>
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...labelProps}
    >
      {children}
    </button>
  )
}
