"use client"

import { useState, useRef, useEffect } from "react"
import { useEditMode } from "@/contexts/EditModeContext"
import { createClient } from "@/lib/supabase/client"
import { Check, X } from "lucide-react"

const supabase = createClient()

interface EditableTextProps {
  value: string
  table: string
  column: string
  rowId: string
  multiline?: boolean
  as?: "span" | "p" | "h1" | "h2" | "h3"
  className?: string
  onSaved?: () => void
}

export function EditableText({
  value,
  table,
  column,
  rowId,
  multiline = false,
  as = "span",
  className = "",
  onSaved,
}: EditableTextProps) {
  const { editMode } = useEditMode()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const Tag = as

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from(table)
      .update({ [column]: draft })
      .eq("id", rowId)
    setSaving(false)
    if (!error) {
      setIsEditing(false)
      onSaved?.()
    } else {
      alert(`Error: ${error.message}`)
    }
  }

  const handleCancel = () => {
    setDraft(value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <span className="inline-flex flex-col gap-1 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="bg-[#0d0d0d] border border-[#00ff00] rounded px-2 py-1 text-[#00ff00] font-mono text-sm w-full min-h-[80px] resize-y"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="bg-[#0d0d0d] border border-[#00ff00] rounded px-2 py-1 text-[#00ff00] font-mono text-sm w-full"
          />
        )}
        <span className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="text-[#00ff00] hover:text-[#00ff00]/70" aria-label="Guardar">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="text-red-500 hover:text-red-400" aria-label="Cancelar">
            <X size={16} />
          </button>
        </span>
      </span>
    )
  }

  return (
    <Tag
      className={`${className} cursor-pointer rounded outline outline-1 outline-dashed outline-[#00ff00]/40 hover:outline-[#00ff00] hover:bg-[#00ff00]/5 transition-colors`}
      onClick={() => setIsEditing(true)}
      title="Click para editar"
    >
      {value}
    </Tag>
  )
}
