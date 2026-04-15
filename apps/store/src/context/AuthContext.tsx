import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Customer {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  whatsapp_opted_in: boolean
  email_opted_in: boolean
}

interface AuthContextValue {
  user: User | null
  customer: Customer | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  openAuthModal: (tab?: 'signin' | 'signup') => void
  closeAuthModal: () => void
  authModalOpen: boolean
  authModalTab: 'signin' | 'signup'
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin')

  async function fetchCustomer(userId: string) {
    const { data } = await supabase
      .from('customers')
      .select('id, email, full_name, phone, avatar_url, whatsapp_opted_in, email_opted_in')
      .eq('id', userId)
      .single()
    setCustomer(data ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchCustomer(session.user.id)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCustomer(session.user.id)
      } else {
        setCustomer(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    setAuthModalOpen(false)
    return { error: null }
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return { error: error.message }
    setAuthModalOpen(false)
    return { error: null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  function openAuthModal(tab: 'signin' | 'signup' = 'signin') {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  function closeAuthModal() {
    setAuthModalOpen(false)
  }

  return (
    <AuthContext.Provider value={{
      user, customer, isLoading,
      signIn, signUp, signOut, resetPassword,
      openAuthModal, closeAuthModal, authModalOpen, authModalTab,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
