"use client"

import { useState } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { AdminInput, AdminButton, AdminCard, AdminHeader } from "@/components/admin/AdminUI"
import type { Translation } from "@/lib/types"
import { Plus, Trash2, X, Save } from "lucide-react"

const supabase = createClient()

function useTranslations() {
  const { data, error, isLoading, mutate } = useSWR<Translation[]>("translations", async () => {
    const { data, error } = await supabase.from("translations").select("*").order("key", { ascending: true })
    if (error) throw error
    return data ?? []
  })
  return { translations: data ?? [], error, isLoading, mutate }
}

export default function TranslationsAdmin() {
  const { translations, isLoading, mutate } = useTranslations()
  const [editing, setEditing] = useState<Partial<Translation> | null>(null)
  const [saving, setSaving] = useState(false)
  const [edits, setEdits] = useState<Record<string, string>>({})

  const handleInline = (id: string, value: string) => {
    setEdits((prev) => ({ ...prev, [id]: value }))
  }

  const saveInline = async (t: Translation) => {
    const value = edits[t.id]
    if (value === undefined) return
    const { error } = await supabase.from("translations").update({ value }).eq("id", t.id)
    if (!error) {
      setEdits((prev) => { const n = { ...prev }; delete n[t.id]; return n })
      mutate()
    } else alert(`Error: ${error.message}`)
  }

  const saveNew = async () => {
    if (!editing) return
    setSaving(true)
    const { error } = await supabase.from("translations").insert({
      locale: editing.locale || "es",
      key: editing.key,
      value: editing.value,
    })
    setSaving(false)
    if (!error) { setEditing(null); mutate() }
    else alert(`Error: ${error.message}`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar esta traduccion?")) return
    const { error } = await supabase.from("translations").delete().eq("id", id)
    if (!error) mutate()
    else alert(`Error: ${error.message}`)
  }

  if (isLoading) return <div className="text-[#00ff00] font-mono animate-pulse">Cargando...</div>

  const grouped = translations.reduce<Record<string, Translation[]>>((acc, t) => {
    (acc[t.locale] ??= []).push(t)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      <AdminHeader
        title="// Traducciones"
        description="Textos de interfaz por idioma (claves i18n)"
        action={<AdminButton type="button" onClick={() => setEditing({ locale: "es", key: "", value: "" })}><span className="flex items-center gap-2"><Plus size={16} /> Nueva</span></AdminButton>}
      />

      <div className="space-y-6">
        {Object.entries(grouped).map(([locale, items]) => (
          <div key={locale}>
            <h2 className="text-[#00ff00]/70 font-mono text-sm mb-2 uppercase">[{locale}]</h2>
            <div className="space-y-2">
              {items.map((t) => (
                <AdminCard key={t.id}>
                  <div className="flex items-center gap-3">
                    <span className="text-[#00ff00]/60 font-mono text-xs w-48 truncate shrink-0">{t.key}</span>
                    <input
                      value={edits[t.id] ?? t.value ?? ""}
                      onChange={(e) => handleInline(t.id, e.target.value)}
                      className="flex-1 bg-[#0d0d0d] border border-[#00ff00]/20 rounded px-2 py-1 text-[#00ff00] font-mono text-sm focus:border-[#00ff00] focus:outline-none"
                    />
                    {edits[t.id] !== undefined && (
                      <button onClick={() => saveInline(t)} className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors" aria-label="Guardar"><Save size={16} /></button>
                    )}
                    <button onClick={() => handleDelete(t.id)} className="text-red-500/60 hover:text-red-500 transition-colors" aria-label="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </AdminCard>
              ))}
            </div>
          </div>
        ))}
        {translations.length === 0 && <p className="text-[#00ff00]/40 font-mono text-sm text-center py-8">No hay traducciones.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-[#1a1a1a] border border-[#00ff00]/40 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[#00ff00] text-lg">Nueva traduccion</h2>
              <button onClick={() => setEditing(null)} className="text-[#00ff00]/60 hover:text-[#00ff00]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="block text-[#00ff00]/70 font-mono text-xs mb-1">Idioma</span>
                <select value={editing.locale ?? "es"} onChange={(e) => setEditing({ ...editing, locale: e.target.value })} className="w-full bg-[#0d0d0d] border border-[#00ff00]/30 rounded px-3 py-2 text-[#00ff00] font-mono text-sm focus:border-[#00ff00] focus:outline-none">
                  <option value="es">es</option>
                  <option value="en">en</option>
                </select>
              </label>
              <AdminInput label="Clave" value={editing.key ?? ""} onChange={(e) => setEditing({ ...editing, key: e.target.value })} />
              <AdminInput label="Valor" value={editing.value ?? ""} onChange={(e) => setEditing({ ...editing, value: e.target.value })} />
              <div className="flex gap-3 pt-2">
                <AdminButton type="button" onClick={saveNew} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</AdminButton>
                <AdminButton type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
