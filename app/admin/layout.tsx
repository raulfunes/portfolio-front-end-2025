'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, Briefcase, FolderOpen, Cpu, Languages, Home, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/profile', label: 'Perfil', icon: User },
  { href: '/admin/experience', label: 'Experiencia', icon: Briefcase },
  { href: '/admin/projects', label: 'Proyectos', icon: FolderOpen },
  { href: '/admin/technologies', label: 'Tecnologias', icon: Cpu },
  { href: '/admin/translations', label: 'Traducciones', icon: Languages },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-[#00ff00] font-mono animate-pulse">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#00ff00]/30 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-[#00ff00]/30">
          <Link href="/" className="flex items-center gap-2 text-[#00ff00] font-mono">
            <span className="text-xl">{'<'}/{'>'}</span>
            <span className="text-sm">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded font-mono text-sm transition-colors ${
                      isActive
                        ? 'bg-[#00ff00] text-[#0d0d0d]'
                        : 'text-[#00ff00]/70 hover:bg-[#00ff00]/10 hover:text-[#00ff00]'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#00ff00]/30">
          <div className="text-[#00ff00]/70 font-mono text-xs mb-2 truncate">
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-500/70 hover:text-red-500 font-mono text-sm transition-colors w-full"
          >
            <LogOut size={16} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
