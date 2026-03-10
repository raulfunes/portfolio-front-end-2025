import React, { useState, useEffect } from 'react'
import { useEditMode } from '../../contexts/EditModeContext'
import { Pencil, Plus, X, Check, GripVertical } from 'lucide-react'
import './Editable.css'

interface EditableArrayProps {
  values: string[]
  onSave: (newValues: string[]) => Promise<void>
  table: string
  id: string
  field: string
  className?: string
  itemClassName?: string
  renderItem?: (item: string, index: number) => React.ReactNode
  placeholder?: string
}

export function EditableArray({
  values,
  onSave,
  table,
  id,
  field,
  className = '',
  itemClassName = '',
  renderItem,
  placeholder = 'Add item...'
}: EditableArrayProps) {
  const { isEditMode, addPendingChange } = useEditMode()
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<string[]>(values)
  const [newItem, setNewItem] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setEditValues(values)
  }, [values])

  const handleSave = async () => {
    const filteredValues = editValues.filter(v => v.trim() !== '')
    
    if (JSON.stringify(filteredValues) === JSON.stringify(values)) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(filteredValues)
      addPendingChange({ table, id, field, newValue: filteredValues, oldValue: values })
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving:', error)
      setEditValues(values)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValues(values)
    setNewItem('')
    setIsEditing(false)
  }

  const handleAddItem = () => {
    if (newItem.trim()) {
      setEditValues([...editValues, newItem.trim()])
      setNewItem('')
    }
  }

  const handleRemoveItem = (index: number) => {
    setEditValues(editValues.filter((_, i) => i !== index))
  }

  const handleUpdateItem = (index: number, value: string) => {
    const newValues = [...editValues]
    newValues[index] = value
    setEditValues(newValues)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddItem()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isEditMode) {
    return (
      <ul className={className}>
        {values.map((item, index) => (
          <li key={index} className={itemClassName}>
            {renderItem ? renderItem(item, index) : item}
          </li>
        ))}
      </ul>
    )
  }

  if (isEditing) {
    return (
      <div className="editable-wrapper editable-editing editable-array-wrapper">
        <ul className="editable-array-list">
          {editValues.map((item, index) => (
            <li key={index} className="editable-array-item">
              <GripVertical size={14} className="editable-array-grip" />
              <input
                type="text"
                value={item}
                onChange={e => handleUpdateItem(index, e.target.value)}
                className="editable-array-input"
                disabled={isSaving}
              />
              <button
                className="editable-btn editable-btn-remove"
                onClick={() => handleRemoveItem(index)}
                disabled={isSaving}
                title="Eliminar"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
        
        <div className="editable-array-add">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="editable-array-input"
            disabled={isSaving}
          />
          <button
            className="editable-btn editable-btn-add"
            onClick={handleAddItem}
            disabled={isSaving || !newItem.trim()}
            title="Agregar"
          >
            <Plus size={14} />
          </button>
        </div>

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
      <ul className={`${className} editable-content`}>
        {values.length > 0 ? (
          values.map((item, index) => (
            <li key={index} className={itemClassName}>
              {renderItem ? renderItem(item, index) : item}
            </li>
          ))
        ) : (
          <li className="editable-placeholder">{placeholder}</li>
        )}
      </ul>
      <Pencil size={14} className="editable-icon" />
    </div>
  )
}
