import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Database } from '@savinra/shared'

type AdminUserRow = Database['public']['Tables']['admin_users']['Row']

interface AdminAuthState {
  admin: AdminUserRow | null
  role: string | null
  isOwner: boolean
  isLoading: boolean
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthState | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUserRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) {
      // No Supabase configured — redirect to login
      setIsLoading(false)
      navigate('/login', { replace: true })
      return
    }

    // Check current session on mount
    checkSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAdmin(null)
        setIsLoading(false)
        navigate('/login', { replace: true })
      } else {
        fetchAdminUser(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkSession() {
    if (!supabase) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setIsLoading(false)
        navigate('/login', { replace: true })
        return
      }
      await fetchAdminUser(session.user.id)
    } catch {
      setIsLoading(false)
      navigate('/login', { replace: true })
    }
  }

  async function fetchAdminUser(userId: string) {
    if (!supabase) return
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        await supabase.auth.signOut()
        setAdmin(null)
        navigate('/login', { replace: true })
        return
      }

      setAdmin(data)
    } finally {
      setIsLoading(false)
    }
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setAdmin(null)
    navigate('/login', { replace: true })
  }

  const value: AdminAuthState = {
    admin,
    role: admin?.role ?? null,
    isOwner: admin?.role === 'owner',
    isLoading,
    signOut,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  }
  return ctx
}
