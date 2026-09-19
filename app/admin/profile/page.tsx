"use client"

import { useState, useEffect } from "react"
import { useProfile } from "@/hooks/use-portfolio-data"
import { createClient } from "@/lib/supabase/client"
import { AdminInput, AdminTextarea, AdminButton, AdminCard, AdminHeader, parseList } from "@/components/admin/AdminUI"
import type { Profile } from "@/lib/types"

const supabase = createClient()

export default function ProfileAdmin() {
  const { profile, isLoading, mutate } = useProfile()
  const [form, setForm] = useState<Partial<Profile>>({})
  const [rolesStr, setRolesStr] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setForm(profile)
      setRolesStr((profile.roles ?? []).join(", "))
    }
  }, [profile])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    const payload = {
      ...form,
      roles: parseList(rolesStr),
      updated_at: new Date().toISOString(),
    }
    let error
    if (profile?.id) {
      ({ error } = await supabase.from("profile").update(payload).eq("id", profile.id))
    } else {
      ({ error } = await supabase.from("profile").insert(payload))
    }
    setSaving(false)
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage("Guardado correctamente")
      mutate()
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (isLoading) {
    return <div className="text-[#00ff00] font-mono animate-pulse">Cargando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AdminHeader title="// Perfil" description="Edita tu informacion personal y de contacto" />

      <AdminCard>
        <div className="space-y-4">
          <AdminInput
            label="Titulo (nombre)"
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <AdminInput
            label="Subtitulo"
            value={form.subtitle ?? ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <AdminTextarea
            label="Parrafo de presentacion"
            value={form.paragraph ?? ""}
            onChange={(e) => setForm({ ...form, paragraph: e.target.value })}
          />
          <AdminInput
            label="Roles rotativos (separados por coma)"
            value={rolesStr}
            onChange={(e) => setRolesStr(e.target.value)}
          />
          <AdminInput
            label="URL de imagen"
            value={form.image_url ?? ""}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminInput
              label="Email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <AdminInput
              label="GitHub URL"
              value={form.github_url ?? ""}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            />
            <AdminInput
              label="LinkedIn URL"
              value={form.linkedin_url ?? ""}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <AdminButton type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </AdminButton>
            {message && (
              <span className={`font-mono text-sm ${message.startsWith("Error") ? "text-red-400" : "text-[#00ff00]"}`}>
                {message}
              </span>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  )
}
