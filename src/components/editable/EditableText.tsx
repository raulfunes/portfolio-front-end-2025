import React, { useState, useEffect, useRef } from 'react'
import { useEditMode } from '../../contexts/EditModeContext'
import { Pencil, Check, X } from 'lucide-react'
import './Editable.css'

interface EditableTextProps {
  value: string
  onSave: (newValue: string) => Promise<void>
  table: string
  id: string
  field: string
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  placeholder?: string
}

export function EditableText({
  value,
  onSave,
  table,
  id,
  field,
  className = '',
  as: Component = 'span',
  placeholder = 'Click to edit...'
}: EditableTextProps) {
  const { isEditMode, addPendingChange } = useEditMode()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
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
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>
  }

  if (isEditing) {
    return (
      <div className="editable-wrapper editable-editing">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="editable-input"
          disabled={isSaving}
        />
        <div className="editable-actions">
          <button
            className="editable-btn editable-btn-save"
            onClick={handleSave}
            disabled={isSaving}
            title="Guardar"
          >
            <Check size={14} />
          </button>
          <button
            className="editable-btn editable-btn-cancel"
            onClick={handleCancel}
            disabled={isSaving}
            title="Cancelar"
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
      <Component className={`${className} editable-content`}>
        {value || <span className="editable-placeholder">{placeholder}</span>}
      </Component>
      <Pencil size={14} className="editable-icon" />
    </div>
  )
}
