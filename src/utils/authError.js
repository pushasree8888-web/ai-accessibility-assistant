export function getFriendlyAuthError(error) {
  const message = error?.message || error?.error_description || ''
  const status = error?.status || 0

  if (
    message.includes('Failed to fetch') ||
    message.includes('placeholder.supabase.co') ||
    message.includes('placeholder-anon-key') ||
    message.includes('Invalid API key') ||
    message.includes('invalid claim')
  ) {
    return 'Supabase is not configured yet. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.'
  }

  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Your email address is not confirmed yet. Please check your inbox for the confirmation link, or disable "Confirm email" in your Supabase Dashboard.'
  }

  if (
    message.toLowerCase().includes('invalid login credentials') ||
    message.toLowerCase().includes('invalid credentials') ||
    message.toLowerCase().includes('user not found')
  ) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }

  if (
    message.toLowerCase().includes('user already registered') ||
    message.toLowerCase().includes('user already exists') ||
    message.toLowerCase().includes('email already in use')
  ) {
    return 'An account already exists for that email. Please try logging in instead.'
  }

  if (message.toLowerCase().includes('password should be at least')) {
    return 'Password must be at least 8 characters long.'
  }

  if (message.toLowerCase().includes('unable to validate email') || message.toLowerCase().includes('invalid email')) {
    return 'Please enter a valid email address.'
  }

  if (message.toLowerCase().includes('rate limit') || status === 429) {
    return 'Too many requests. Please wait a moment and try again.'
  }

  return message || 'Authentication failed. Please try again.'
}
