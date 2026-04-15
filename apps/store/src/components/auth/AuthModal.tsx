import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal, signIn, signUp, resetPassword } = useAuth()

  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>(authModalTab)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')

  // Sync tab when modal opens
  if (!authModalOpen) return null

  const inputCls = "w-full px-4 py-3 font-body text-sm text-cocoa bg-white border border-cocoa/20 rounded-lg focus:outline-none focus:border-gold-accessible transition-colors placeholder:text-cocoa/35"

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error)
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) setError(error)
    else setSuccess('Check your email to confirm your account.')
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) setError(error)
    else setSuccess('Password reset link sent — check your inbox.')
  }

  function switchTab(t: 'signin' | 'signup' | 'forgot') {
    setTab(t)
    setError(null)
    setSuccess(null)
    openAuthModal(t === 'forgot' ? 'signin' : t)
  }

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-cocoa/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="bg-parchment rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
              <button onClick={closeAuthModal} className="absolute top-4 right-4 text-cocoa/40 hover:text-cocoa transition-colors">
                <X size={20} />
              </button>

              {/* Logo */}
              <div className="text-center mb-6">
                <img src="/savinra-logo.svg" alt="SAVINRA" className="h-8 w-auto mx-auto mb-2" />
                <p className="font-body text-sm text-cocoa/60">
                  {tab === 'signin' && 'Welcome back'}
                  {tab === 'signup' && 'Create your account'}
                  {tab === 'forgot' && 'Reset your password'}
                </p>
              </div>

              {/* Tabs */}
              {tab !== 'forgot' && (
                <div className="flex border border-cocoa/15 rounded-lg mb-6 overflow-hidden">
                  {(['signin', 'signup'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => switchTab(t)}
                      className={cn(
                        'flex-1 py-2.5 font-body text-sm font-medium transition-colors',
                        tab === t ? 'bg-gold-accessible text-white' : 'text-cocoa/60 hover:text-cocoa'
                      )}
                    >
                      {t === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                  ))}
                </div>
              )}

              {/* Error / Success */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg font-body text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg font-body text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* Sign In */}
              {tab === 'signin' && !success && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Email</label>
                    <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={cn(inputCls, 'pr-10')} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa/40">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button type="button" onClick={() => switchTab('forgot')} className="font-body text-xs text-gold-accessible hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-gold-accessible text-white font-body font-medium py-3 rounded-full hover:bg-cocoa transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Sign In
                  </button>
                </form>
              )}

              {/* Sign Up */}
              {tab === 'signup' && !success && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Full Name</label>
                    <input type="text" required placeholder="Priya Sharma" value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Email</label>
                    <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} className={cn(inputCls, 'pr-10')} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa/40">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Confirm Password</label>
                    <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputCls} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-gold-accessible text-white font-body font-medium py-3 rounded-full hover:bg-cocoa transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Create Account
                  </button>
                  <p className="font-body text-xs text-cocoa/50 text-center">
                    By creating an account you agree to our Terms & Privacy Policy.
                  </p>
                </form>
              )}

              {/* Forgot Password */}
              {tab === 'forgot' && !success && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="font-body text-sm text-cocoa/70">Enter your email and we'll send a reset link.</p>
                  <div>
                    <label className="font-body text-xs uppercase tracking-wide text-cocoa/60 mb-1.5 block">Email</label>
                    <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-gold-accessible text-white font-body font-medium py-3 rounded-full hover:bg-cocoa transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Send Reset Link
                  </button>
                  <button type="button" onClick={() => switchTab('signin')} className="w-full font-body text-sm text-cocoa/60 hover:text-cocoa transition-colors">
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
