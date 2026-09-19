"use client"

import { useEditMode } from "@/contexts/EditModeContext"
import Link from "next/link"
import { Pencil, Check, LayoutDashboard } from "lucide-react"

export function FloatingEditButton() {
  const { isAdmin, editMode, toggleEditMode } = useEditMode()

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <Link
        href="/admin"
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#00ff00]/40 text-[#00ff00] font-mono text-xs px-3 py-2 rounded-full shadow-lg hover:border-[#00ff00] transition-colors"
        aria-label="Ir al panel de administracion"
      >
        <LayoutDashboard size={14} />
        Panel
      </Link>

      <button
        onClick={toggleEditMode}
        className={`flex items-center gap-2 font-mono text-sm px-4 py-3 rounded-full shadow-lg transition-all ${
          editMode
            ? "bg-[#00ff00] text-[#0d0d0d] hover:bg-[#00ff00]/80"
            : "bg-[#1a1a1a] border border-[#00ff00]/40 text-[#00ff00] hover:border-[#00ff00]"
        }`}
        aria-label={editMode ? "Salir del modo edicion" : "Activar modo edicion"}
      >
        {editMode ? <Check size={16} /> : <Pencil size={16} />}
        {editMode ? "Terminar" : "Editar"}
      </button>
    </div>
  )
}
