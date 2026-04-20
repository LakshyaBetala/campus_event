"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, GraduationCap, Building2, ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

type Role = 'STUDENT' | 'FACULTY' | 'ADMIN'

const ROLE_DEMO = {
  STUDENT: { email: 'student@demo.com', password: 'password123' },
  FACULTY: { email: 'faculty@demo.com', password: 'password123' },
  ADMIN:   { email: 'admin@demo.com',   password: 'password123' },
}

const ROLE_DESTINATIONS: Record<string, string> = {
  STUDENT: '/student',
  FACULTY: '/faculty',
  ADMIN: '/admin',
}

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('STUDENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'An unexpected error occurred.')
        return
      }

      // Route based on actual role returned from the database
      const destination = ROLE_DESTINATIONS[data.user.role]
      if (destination) {
        router.push(destination)
      } else {
        setError('Unknown role. Please contact support.')
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError(null)
    const demo = ROLE_DEMO[role]
    setEmail(demo.email)
    setPassword(demo.password)
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demo),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(ROLE_DESTINATIONS[data.user.role] || '/')
      } else {
        setError(data.error)
      }
    } catch {
      setError('Network error.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20 hidden md:block"></div>

        <div className="bg-neutral-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
              <CalendarDays className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-1 text-white">Campus Events</h1>
          <p className="text-neutral-400 text-center mb-8 text-sm">Sign in to manage and join activities</p>

          {/* Role Toggle */}
          <div className="flex bg-neutral-900/50 p-1 rounded-lg mb-6 border border-white/5">
            {(['STUDENT', 'FACULTY', 'ADMIN'] as Role[]).map((r) => {
              const Icon = r === 'STUDENT' ? GraduationCap : r === 'FACULTY' ? Building2 : ShieldCheck
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setError(null) }}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${role === r ? 'bg-neutral-800 text-white shadow-sm border border-white/10' : 'text-neutral-400 hover:text-white'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              )
            })}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null) }}
                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                placeholder={`${role.toLowerCase()}@demo.com`}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => { setPassword(e.target.value); setError(null) }}
                className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-center text-xs text-neutral-500 mb-3">Demo one-click access</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
            >
              Login as Demo {role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
