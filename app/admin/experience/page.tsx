"use client"

import { useState } from "react"
import { useExperiences } from "@/hooks/use-portfolio-data"
import { createClient } from "@/lib/supabase/client"
import { AdminInput, AdminTextarea, AdminButton, AdminCard, AdminHeader, parseList } from "@/components/admin/AdminUI"
import type { Experience } from "@/lib/types"
import { Plus, Trash2, Pencil, X } from "lucide-react"

const supabase = createClient()

const emptyExp: Partial<Experience> = {
  title: "",
  company: "",
  period: "",
  duration: "",
  type: "",
  location: "",
  description_es: "",
  description_en: "",
  achievements_es: [],
  achievements_en: [],
  technologies: [],
  display_order: 0,
}

export default function ExperienceAdmin() {
  const { experiences, isLoading, mutate } = useExperiences()
  const [editing, setEditing] = useState<Partial<Experience> | null>(null)
  const [techStr, setTechStr] = useState("")
  const [achEsStr, setAchEsStr] = useState("")
  const [achEnStr, setAchEnStr] = useState("")
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setEditing({ ...emptyExp, display_order: experiences.length })
    setTechStr(""); setAchEsStr(""); setAchEnStr("")
  }

  const openEdit = (e: Experience) => {
    setEditing(e)
    setTechStr((e.technologies ?? []).join(", "))
    setAchEsStr((e.achievements_es ?? []).join("\n"))
    setAchEnStr((e.achievements_en ?? []).join("\n"))
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const payload = {
      title: editing.title,
      company: editing.company,
      period: editing.period,
      duration: editing.duration,
      type: editing.type,
      location: editing.location,
      description_es: editing.description_es,
      description_en: editing.description_en,
      achievements_es: achEsStr.split("\n").map((s) => s.trim()).filter(Boolean),
      achievements_en: achEnStr.split("\n").map((s) => s.trim()).filter(Boolean),
      technologies: parseList(techStr),
      display_order: editing.display_order ?? 0,
      updated_at: new Date().toISOString(),
    }
    let error
    if (editing.id) {
      ({ error } = await supabase.from("experiences").update(payload).eq("id", editing.id))
    } else {
      ({ error } = await supabase.from("experiences").insert(payload))
    }
    setSaving(false)
    if (!error) { setEditing(null); mutate() }
    else alert(`Error: ${error.message}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar esta experiencia?")) return
    const { error } = await supabase.from("experiences").delete().eq("id", id)
    if (!error) mutate()
    else alert(`Error: ${error.message}`)
  }

  if (isLoading) return <div className="text-[#00ff00] font-mono animate-pulse">Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <AdminHeader
        title="// Experiencia"
        description="Gestiona tu trayectoria profesional"
        action={<AdminButton type="button" onClick={openNew}><span className="flex items-center gap-2"><Plus size={16} /> Nueva</span></AdminButton>}
      />

      <div className="space-y-3">
        {experiences.map((e) => (
          <AdminCard key={e.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#00ff00] font-mono">{e.title}</span>
                  <span className="text-[#00ff00]/40 font-mono text-xs">@ {e.company}</span>
                </div>
                <p className="text-[#00ff00]/50 font-mono text-xs">{e.period} · {e.location} · {e.type}</p>
                <p className="text-[#00ff00]/60 font-mono text-xs line-clamp-1 mt-1">{e.description_es}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(e)} className="text-[#00ff00]/60 hover:text-[#00ff00] transition-colors" aria-label="Editar"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(e.id)} className="text-red-500/60 hover:text-red-500 transition-colors" aria-label="Eliminar"><Trash2 size={16} /></button>
              </div>
            </div>
          </AdminCard>
        ))}
        {experiences.length === 0 && <p className="text-[#00ff00]/40 font-mono text-sm text-center py-8">No hay experiencias. Crea una nueva.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-[#1a1a1a] border border-[#00ff00]/40 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={(ev) => ev.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[#00ff00] text-lg">{editing.id ? "Editar experiencia" : "Nueva experiencia"}</h2>
              <button onClick={() => setEditing(null)} className="text-[#00ff00]/60 hover:text-[#00ff00]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Cargo" value={editing.title ?? ""} onChange={(ev) => setEditing({ ...editing, title: ev.target.value })} />
                <AdminInput label="Empresa" value={editing.company ?? ""} onChange={(ev) => setEditing({ ...editing, company: ev.target.value })} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AdminInput label="Periodo" value={editing.period ?? ""} onChange={(ev) => setEditing({ ...editing, period: ev.target.value })} />
                <AdminInput label="Duracion" value={editing.duration ?? ""} onChange={(ev) => setEditing({ ...editing, duration: ev.target.value })} />
                <AdminInput label="Tipo" value={editing.type ?? ""} onChange={(ev) => setEditing({ ...editing, type: ev.target.value })} />
                <AdminInput label="Ubicacion" value={editing.location ?? ""} onChange={(ev) => setEditing({ ...editing, location: ev.target.value })} />
              </div>
              <AdminTextarea label="Descripcion (ES)" value={editing.description_es ?? ""} onChange={(ev) => setEditing({ ...editing, description_es: ev.target.value })} />
              <AdminTextarea label="Descripcion (EN)" value={editing.description_en ?? ""} onChange={(ev) => setEditing({ ...editing, description_en: ev.target.value })} />
              <AdminTextarea label="Logros ES (uno por linea)" value={achEsStr} onChange={(ev) => setAchEsStr(ev.target.value)} />
              <AdminTextarea label="Logros EN (uno por linea)" value={achEnStr} onChange={(ev) => setAchEnStr(ev.target.value)} />
              <AdminInput label="Tecnologias (separadas por coma)" value={techStr} onChange={(ev) => setTechStr(ev.target.value)} />
              <AdminInput label="Orden" type="number" value={editing.display_order ?? 0} onChange={(ev) => setEditing({ ...editing, display_order: parseInt(ev.target.value) || 0 })} />
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
