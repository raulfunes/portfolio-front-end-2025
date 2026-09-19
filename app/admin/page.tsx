"use client"

import { useProfile, useProjects, useExperiences, useTechnologies } from "@/hooks/use-portfolio-data"
import Link from "next/link"
import { User, Briefcase, FolderOpen, Cpu, ArrowRight } from "lucide-react"

export default function AdminDashboard() {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const { experiences } = useExperiences()
  const { categories } = useTechnologies()

  const techCount = categories.reduce((acc, c) => acc + c.technologies.length, 0)

  const stats = [
    { label: "Proyectos", value: projects.length, icon: FolderOpen, href: "/admin/projects" },
    { label: "Experiencias", value: experiences.length, icon: Briefcase, href: "/admin/experience" },
    { label: "Tecnologias", value: techCount, icon: Cpu, href: "/admin/technologies" },
    { label: "Categorias", value: categories.length, icon: Cpu, href: "/admin/technologies" },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-mono text-[#00ff00] mb-2">
          {"// Dashboard"}
        </h1>
        <p className="text-[#00ff00]/60 font-mono text-sm">
          Bienvenido al panel de administracion. Gestiona el contenido de tu portfolio.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-[#1a1a1a] border border-[#00ff00]/30 rounded-lg p-4 hover:border-[#00ff00]/60 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="text-[#00ff00]/70" size={20} />
                <ArrowRight className="text-[#00ff00]/40 group-hover:text-[#00ff00] transition-colors" size={16} />
              </div>
              <div className="text-3xl font-mono text-[#00ff00] mb-1">{stat.value}</div>
              <div className="text-[#00ff00]/60 font-mono text-xs">{stat.label}</div>
            </Link>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/profile"
          className="bg-[#1a1a1a] border border-[#00ff00]/30 rounded-lg p-6 hover:border-[#00ff00]/60 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <User className="text-[#00ff00]" size={24} />
            <h2 className="font-mono text-[#00ff00] text-lg">Perfil</h2>
          </div>
          <p className="text-[#00ff00]/60 font-mono text-sm mb-3">
            {profile?.title || "Sin configurar"} — {profile?.subtitle || ""}
          </p>
          <span className="text-[#00ff00]/40 group-hover:text-[#00ff00] font-mono text-xs flex items-center gap-1 transition-colors">
            Editar perfil <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href="/"
          className="bg-[#1a1a1a] border border-[#00ff00]/30 rounded-lg p-6 hover:border-[#00ff00]/60 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[#00ff00] text-2xl font-mono">{"</>"}</span>
            <h2 className="font-mono text-[#00ff00] text-lg">Ver Portfolio</h2>
          </div>
          <p className="text-[#00ff00]/60 font-mono text-sm mb-3">
            Visita tu portfolio publico y usa el modo edicion inline.
          </p>
          <span className="text-[#00ff00]/40 group-hover:text-[#00ff00] font-mono text-xs flex items-center gap-1 transition-colors">
            Ir al portfolio <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </div>
  )
}
