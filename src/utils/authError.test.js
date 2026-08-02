import { describe, expect, it } from 'vitest'
import { getFriendlyAuthError } from './authError'

describe('getFriendlyAuthError for Supabase', () => {
  it('maps unconfigured / network fetch error', () => {
    expect(
      getFriendlyAuthError({ message: 'Failed to fetch' }),
    ).toBe('Supabase is not configured yet. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.')
  })

  it('maps email logins disabled error', () => {
    expect(
      getFriendlyAuthError({ message: 'Email logins are disabled' }),
    ).toBe('Email logins are disabled in your Supabase Dashboard. Enable Email provider under Authentication -> Providers -> Email in Supabase Dashboard.')
  })

  it('maps invalid login credentials', () => {
    expect(
      getFriendlyAuthError({ message: 'Invalid login credentials' }),
    ).toBe('Invalid email or password. Please check your credentials and try again.')
  })

  it('maps user already registered error', () => {
    expect(
      getFriendlyAuthError({ message: 'User already registered' }),
    ).toBe('An account already exists for that email. Please try logging in instead.')
  })

  it('maps password length error', () => {
    expect(
      getFriendlyAuthError({ message: 'Password should be at least 6 characters' }),
    ).toBe('Password must be at least 8 characters long.')
  })

  it('falls back to custom message or default', () => {
    expect(getFriendlyAuthError({ message: 'Custom error message' })).toBe('Custom error message')
    expect(getFriendlyAuthError(null)).toBe('Authentication failed. Please try again.')
  })
})
