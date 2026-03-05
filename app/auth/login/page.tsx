'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Check if user is admin
    const isAdmin = data.user?.user_metadata?.is_admin === true
    if (!isAdmin) {
      setError('No tienes permisos de administrador')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="terminal-frame bg-[#1a1a1a] border-2 border-[#00ff00] rounded-lg overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border-b border-[#00ff00]/30">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-2 text-[#00ff00] text-sm font-mono">admin@portfolio ~ login</span>
          </div>
          
          {/* Terminal content */}
          <div className="p-6">
            <h1 className="text-[#00ff00] font-mono text-xl mb-6">
              {'>'} Admin Login_
            </h1>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[#00ff00]/70 font-mono text-sm block mb-1">
                  $ email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#00ff00]/50 text-[#00ff00] font-mono p-2 rounded focus:outline-none focus:border-[#00ff00] placeholder-[#00ff00]/30"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="text-[#00ff00]/70 font-mono text-sm block mb-1">
                  $ password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#00ff00]/50 text-[#00ff00] font-mono p-2 rounded focus:outline-none focus:border-[#00ff00] placeholder-[#00ff00]/30"
                  placeholder="********"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 font-mono text-sm border border-red-500/50 bg-red-500/10 p-2 rounded">
                  Error: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00ff00] text-[#0d0d0d] font-mono font-bold py-2 px-4 rounded hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '> Authenticating...' : '> Login'}
              </button>
            </form>

            <div className="mt-6 text-[#00ff00]/50 font-mono text-xs">
              <p>Tip: Solo usuarios con permisos de admin pueden acceder.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <a href="/" className="text-[#00ff00]/70 hover:text-[#00ff00] font-mono text-sm">
            {'<'} Volver al portfolio
          </a>
        </div>
      </div>
    </div>
  )
}
