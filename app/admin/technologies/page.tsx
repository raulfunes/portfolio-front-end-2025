"use client"

import { useState } from "react"
import { useTechnologies } from "@/hooks/use-portfolio-data"
import { createClient } from "@/lib/supabase/client"
import { AdminInput, AdminButton, AdminCard, AdminHeader } from "@/components/admin/AdminUI"
import type { TechCategory, Technology } from "@/lib/types"
import { Plus, Trash2, Pencil, X } from "lucide-react"

const supabase = createClient()

export default function TechnologiesAdmin() {
  const { categories, isLoading, mutate } = useTechnologies()
  const [editingCat, setEditingCat] = useState<Partial<TechCategory> | null>(null)
  const [editingTech, setEditingTech] = useState<Partial<Technology> | null>(null)
  const [saving, setSaving] = useState(false)

  // Category CRUD
  const saveCategory = async () => {
    if (!editingCat) return
    setSaving(true)
    const payload = {
      name_es: editingCat.name_es,
      name_en: editingCat.name_en,
      icon: editingCat.icon,
      display_order: editingCat.display_order ?? 0,
    }
    let error
    if (editingCat.id) {
      ({ error } = await supabase.from("tech_categories").update(payload).eq("id", editingCat.id))
    } else {
      ({ error } = await supabase.from("tech_categories").insert(payload))
    }
    setSaving(false)
    if (!error) { setEditingCat(null); mutate() }
    else alert(`Error: ${error.message}`)
  }

  const deleteCategory = async (id: string) => {
    if (!confirm("Eliminar categoria y todas sus tecnologias?")) return
    const { error } = await supabase.from("tech_categories").delete().eq("id", id)
    if (!error) mutate()
    else alert(`Error: ${error.message}`)
  }

  // Technology CRUD
  const saveTech = async () => {
    if (!editingTech) return
    setSaving(true)
    const payload = {
      category_id: editingTech.category_id,
      name: editingTech.name,
      level: editingTech.level ?? 50,
      color: editingTech.color ?? "#00ff00",
      display_order: editingTech.display_order ?? 0,
    }
    let error
    if (editingTech.id) {
      ({ error } = await supabase.from("technologies").update(payload).eq("id", editingTech.id))
    } else {
      ({ error } = await supabase.from("technologies").insert(payload))
    }
    setSaving(false)
    if (!error) { setEditingTech(null); mutate() }
    else alert(`Error: ${error.message}`)
  }

  const deleteTech = async (id: string) => {
    if (!confirm("Eliminar esta tecnologia?")) return
    const { error } = await supabase.from("technologies").delete().eq("id", id)
    if (!error) mutate()
    else alert(`Error: ${error.message}`)
  }

  if (isLoading) return <div className="text-[#00ff00] font-mono animate-pulse">Cargando...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <AdminHeader
        title="// Tecnologias"
        description="Gestiona categorias y niveles de habilidad"
        action={
          <AdminButton type="button" onClick={() => setEditingCat({ name_es: "", name_en: "", icon: "[>_]", display_order: categories.length })}>
            <span className="flex items-center gap-2"><Plus size={16} /> Categoria</span>
          </AdminButton>
        }
      />

      <div className="space-y-4">
        {categories.map((cat) => (
          <AdminCard key={cat.id}>
            <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-[#00ff00]/20">
              <div className="flex items-center gap-2">
                <span className="text-[#00ff00]/60 font-mono text-sm">{cat.icon}</span>
                <span className="text-[#00ff00] font-mono">{cat.name_es}</span>
                <span className="text-[#00ff00]/40 font-mono text-xs">/ {cat.name_en}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingTech({ category_id: cat.id, name: "", level: 50, color: "#00ff00", display_order: cat.technologies.length })} className="text-[#00ff00]/60 hover:text-[#00ff00] transition-colors" aria-label="Agregar tecnologia"><Plus size={16} /></button>
                <button onClick={() => setEditingCat(cat)} className="text-[#00ff00]/60 hover:text-[#00ff00] transition-colors" aria-label="Editar categoria"><Pencil size={16} /></button>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-500/60 hover:text-red-500 transition-colors" aria-label="Eliminar categoria"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="space-y-2">
              {cat.technologies.map((tech) => (
                <div key={tech.id} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tech.color }} />
                  <span className="text-[#00ff00]/80 font-mono text-sm w-32 truncate">{tech.name}</span>
                  <div className="flex-1 h-1.5 bg-[#00ff00]/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00ff00]/60 rounded-full" style={{ width: `${tech.level}%` }} />
                  </div>
                  <span className="text-[#00ff00]/50 font-mono text-xs w-10 text-right">{tech.level}%</span>
                  <button onClick={() => setEditingTech(tech)} className="text-[#00ff00]/60 hover:text-[#00ff00] transition-colors" aria-label="Editar"><Pencil size={14} /></button>
                  <button onClick={() => deleteTech(tech.id)} className="text-red-500/60 hover:text-red-500 transition-colors" aria-label="Eliminar"><Trash2 size={14} /></button>
                </div>
              ))}
              {cat.technologies.length === 0 && <p className="text-[#00ff00]/30 font-mono text-xs">Sin tecnologias</p>}
            </div>
          </AdminCard>
        ))}
        {categories.length === 0 && <p className="text-[#00ff00]/40 font-mono text-sm text-center py-8">No hay categorias. Crea una nueva.</p>}
      </div>

      {/* Category modal */}
      {editingCat && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setEditingCat(null)}>
          <div className="bg-[#1a1a1a] border border-[#00ff00]/40 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[#00ff00] text-lg">{editingCat.id ? "Editar categoria" : "Nueva categoria"}</h2>
              <button onClick={() => setEditingCat(null)} className="text-[#00ff00]/60 hover:text-[#00ff00]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <AdminInput label="Nombre (ES)" value={editingCat.name_es ?? ""} onChange={(e) => setEditingCat({ ...editingCat, name_es: e.target.value })} />
              <AdminInput label="Nombre (EN)" value={editingCat.name_en ?? ""} onChange={(e) => setEditingCat({ ...editingCat, name_en: e.target.value })} />
              <AdminInput label="Icono (ej: [>_])" value={editingCat.icon ?? ""} onChange={(e) => setEditingCat({ ...editingCat, icon: e.target.value })} />
              <AdminInput label="Orden" type="number" value={editingCat.display_order ?? 0} onChange={(e) => setEditingCat({ ...editingCat, display_order: parseInt(e.target.value) || 0 })} />
              <div className="flex gap-3 pt-2">
                <AdminButton type="button" onClick={saveCategory} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</AdminButton>
                <AdminButton type="button" variant="ghost" onClick={() => setEditingCat(null)}>Cancelar</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technology modal */}
      {editingTech && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setEditingTech(null)}>
          <div className="bg-[#1a1a1a] border border-[#00ff00]/40 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[#00ff00] text-lg">{editingTech.id ? "Editar tecnologia" : "Nueva tecnologia"}</h2>
              <button onClick={() => setEditingTech(null)} className="text-[#00ff00]/60 hover:text-[#00ff00]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <AdminInput label="Nombre" value={editingTech.name ?? ""} onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })} />
              <label className="block">
                <span className="block text-[#00ff00]/70 font-mono text-xs mb-1">Nivel: {editingTech.level ?? 50}%</span>
                <input type="range" min="0" max="100" value={editingTech.level ?? 50} onChange={(e) => setEditingTech({ ...editingTech, level: parseInt(e.target.value) })} className="w-full accent-[#00ff00]" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-[#00ff00]/70 font-mono text-xs mb-1">Color</span>
                  <input type="color" value={editingTech.color ?? "#00ff00"} onChange={(e) => setEditingTech({ ...editingTech, color: e.target.value })} className="w-full h-10 bg-[#0d0d0d] border border-[#00ff00]/30 rounded cursor-pointer" />
                </label>
                <AdminInput label="Orden" type="number" value={editingTech.display_order ?? 0} onChange={(e) => setEditingTech({ ...editingTech, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex gap-3 pt-2">
                <AdminButton type="button" onClick={saveTech} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</AdminButton>
                <AdminButton type="button" variant="ghost" onClick={() => setEditingTech(null)}>Cancelar</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
