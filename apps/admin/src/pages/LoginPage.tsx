import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!supabase) {
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      setIsLoading(false)
      return
    }

    try {
      const { error: signInError } = await supabase!.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError('Invalid email or password.')
        return
      }

      navigate('/dashboard', { replace: true })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-semibold text-cocoa tracking-widest">
            SAVINRA
          </h1>
          <p className="mt-1 text-sm text-cocoa/50 font-body tracking-wide">
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="bg-parchment rounded-card shadow-card border border-admin-border p-8">
          <h2 className="font-heading text-xl font-medium text-cocoa mb-6">
            Sign in to continue
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-cocoa/70 font-body mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-admin-border rounded text-cocoa placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors duration-150"
                placeholder="admin@savinra.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-cocoa/70 font-body mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-admin-border rounded text-cocoa placeholder-cocoa/30 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors duration-150"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-error font-body bg-error/8 border border-error/20 rounded px-3 py-2"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-2.5 px-4 bg-gold text-cocoa text-sm font-semibold font-body rounded-pill hover:bg-gold-accessible hover:text-parchment transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-cocoa/30 font-body mt-6">
          Access restricted to authorised Savinra team members only.
        </p>
      </div>
    </div>
  )
}
