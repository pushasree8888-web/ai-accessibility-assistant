import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial session on app mount
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setCurrentUser(initialSession?.user ?? null)
      setLoading(false)
    }).catch((err) => {
      console.warn('[AuthContext] Could not fetch session', err)
      setLoading(false)
    })

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setCurrentUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signup = async (email, password) => {
    console.info('[AuthContext] Attempting Supabase email sign up')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const login = async (email, password) => {
    console.info('[AuthContext] Attempting Supabase email login')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const loginWithGoogle = async () => {
    console.info('[AuthContext] Attempting Supabase Google sign in')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) throw error
    return data
  }

  const logout = async () => {
    console.info('[AuthContext] Logging out from Supabase')
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = useMemo(
    () => ({
      currentUser,
      session,
      login,
      signup,
      loginWithGoogle,
      logout,
      loading,
    }),
    [currentUser, session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
