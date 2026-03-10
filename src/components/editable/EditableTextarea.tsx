import React, { useState, useEffect, useRef } from 'react'
import { useEditMode } from '../../contexts/EditModeContext'
import { Pencil, Check, X } from 'lucide-react'
import './Editable.css'

interface EditableTextareaProps {
  value: string
  onSave: (newValue: string) => Promise<void>
  table: string
  id: string
  field: string
  className?: string
  placeholder?: string
  rows?: number
}

export function EditableTextarea({
  value,
  onSave,
  table,
  id,
  field,
  className = '',
  placeholder = 'Click to edit...',
  rows = 3
}: EditableTextareaProps) {
  const { isEditMode, addPendingChange } = useEditMode()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(editValue)
      addPendingChange({ table, id, field, newValue: editValue, oldValue: value })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
      setEditValue(value)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave()
    }
  }

  if (!isEditMode) {
    return <p className={className}>{value}</p>
  }

  if (isEditing) {
    return (
      <div className="editable-wrapper editable-editing editable-textarea-wrapper">
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="editable-textarea"
          disabled={isSaving}
          rows={rows}
        />
        <div className="editable-actions">
          <button
            className="editable-btn editable-btn-save"
            onClick={handleSave}
            disabled={isSaving}
            title="Guardar (Ctrl+Enter)"
          >
            <Check size={14} />
          </button>
          <button
            className="editable-btn editable-btn-cancel"
            onClick={handleCancel}
            disabled={isSaving}
            title="Cancelar (Esc)"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="editable-wrapper"
      onClick={() => setIsEditing(true)}
    >
      <p className={`${className} editable-content`}>
        {value || <span className="editable-placeholder">{placeholder}</span>}
      </p>
      <Pencil size={14} className="editable-icon" />
    </div>
  )
}
