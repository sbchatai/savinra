import { createClient } from '@supabase/supabase-js'
import type { Database } from '@savinra/shared'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Provide a placeholder URL/key when env vars are missing in production
// so that TypeScript strict mode doesn't complain about null everywhere.
const _url = supabaseUrl || 'https://placeholder.supabase.co'
const _key = supabaseAnonKey || 'placeholder-anon-key'

export const supabase = createClient<Database>(_url, _key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export function assertSupabase(): void {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Supabase env vars are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
}
