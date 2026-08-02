import { describe, expect, it } from 'vitest'
import { isValidEmail, isValidPassword } from './authValidation'

describe('auth validation', () => {
  it('accepts properly formatted emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
  })

  it('requires at least eight characters for passwords', () => {
    expect(isValidPassword('short')).toBe(false)
    expect(isValidPassword('longenough1')).toBe(true)
  })
})
