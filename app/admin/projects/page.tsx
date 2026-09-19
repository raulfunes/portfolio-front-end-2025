"use client"

import { useState } from "react"
import { useProjects } from "@/hooks/use-portfolio-data"
import { createClient } from "@/lib/supabase/client"
import { AdminInput, AdminTextarea, AdminButton, AdminCard, AdminHeader, parseList } from "@/components/admin/AdminUI"
import type { Project } from "@/lib/types"
import { Plus, Trash2, Pencil, X } from "lucide-react"

const supabase = createClient()

const emptyProject: Partial<Project> = {
  title: "",
  description_es: "",
  description_en: "",
  tech: [],
  image_url: "",
  demo_link: "",
  github_link: "",
  status: "development",
  year: new Date().getFullYear().toString(),
  display_order: 0,
}

export default function ProjectsAdmin() {
  const { projects, isLoading, mutate } = useProjects()
  const [editing, setEditing] = useState<Partial<Project> | null>(null)
  const [techStr, setTechStr] = useState("")
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditing({ ...emptyProject, display_order: projects.length })
    setTechStr("")
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setTechStr((p.tech ?? []).join(", "))
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const payload = {
      title: editing.title,
      description_es: editing.description_es,
      description_en: editing.description_en,
      tech: parseList(techStr),
      image_url: editing.image_url,
      demo_link: editing.demo_link,
      github_link: editing.github_link,
      status: editing.status,
      year: editing.year,
      display_order: editing.display_order ?? 0,
      updated_at: new Date().toISOString(),
    }
    let error
    if (editing.id) {
      ({ error } = await supabase.from("projects").update(payload).eq("id", editing.id))
    } else {
      ({ error } = await supabase.from("projects").insert(payload))
    }
    setSaving(false)
    if (!error) {
      setEditing(null)
      mutate()
    } else {
      alert(`Error: ${error.message}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este proyecto?")) return
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (!error) mutate()
    else alert(`Error: ${error.message}`)
  }

  if (isLoading) {
    return <div className="text-[#00ff00] font-mono animate-pulse">Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminHeader
        title="// Proyectos"
        description="Gestiona los proyectos de tu portfolio"
        action={
          <AdminButton type="button" onClick={openNew}>
            <span className="flex items-center gap-2"><Plus size={16} /> Nuevo</span>
          </AdminButton>
        }
      />

      <div className="space-y-3">
        {projects.map((p) => (
          <AdminCard key={p.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#00ff00] font-mono">{p.title}</span>
                  <span className="text-[#00ff00]/40 font-mono text-xs">[{p.status}]</span>
                  <span className="text-[#00ff00]/40 font-mono text-xs">{p.year}</span>
                </div>
                <p className="text-[#00ff00]/60 font-mono text-xs line-clamp-1">{p.description_es}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(p.tech ?? []).map((t) => (
                    <span key={t} className="text-[#00ff00]/50 font-mono text-[10px] border border-[#00ff00]/20 rounded px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="text-[#00ff00]/60 hover:text-[#00ff00] transition-colors" aria-label="Editar">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500/60 hover:text-red-500 transition-colors" aria-label="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
        {projects.length === 0 && (
          <p className="text-[#00ff00]/40 font-mono text-sm text-center py-8">No hay proyectos. Crea uno nuevo.</p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-[#1a1a1a] border border-[#00ff00]/40 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[#00ff00] text-lg">{editing.id ? "Editar proyecto" : "Nuevo proyecto"}</h2>
              <button onClick={() => setEditing(null)} className="text-[#00ff00]/60 hover:text-[#00ff00]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <AdminInput label="Titulo" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              <AdminTextarea label="Descripcion (ES)" value={editing.description_es ?? ""} onChange={(e) => setEditing({ ...editing, description_es: e.target.value })} />
              <AdminTextarea label="Descripcion (EN)" value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} />
              <AdminInput label="Tecnologias (separadas por coma)" value={techStr} onChange={(e) => setTechStr(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Link Demo" value={editing.demo_link ?? ""} onChange={(e) => setEditing({ ...editing, demo_link: e.target.value })} />
                <AdminInput label="Link GitHub" value={editing.github_link ?? ""} onChange={(e) => setEditing({ ...editing, github_link: e.target.value })} />
              </div>
              <AdminInput label="URL de imagen" value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="block text-[#00ff00]/70 font-mono text-xs mb-1">Estado</span>
                  <select
                    value={editing.status ?? "development"}
                    onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                    className="w-full bg-[#0d0d0d] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] font-mono text-sm focus:border-[#00ff00] focus:outline-none"
                  >
                    <option value="live">live</option>
                    <option value="development">development</option>
                    <option value="archived">archived</option>
                  </select>
                </label>
                <AdminInput label="Año" value={editing.year ?? ""} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
                <AdminInput label="Orden" type="number" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex gap-3 pt-2">
                <AdminButton type="button" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</AdminButton>
                <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
