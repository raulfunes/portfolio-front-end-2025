import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEditMode } from '../contexts/EditModeContext'
import { Pencil, LogOut, X, Globe } from 'lucide-react'
import './EditToolbar.css'

export function EditToolbar() {
  const { user, signOut, isAuthenticated } = useAuth()
  const { isEditMode, editLanguage, setEditLanguage, toggleEditMode } = useEditMode()

  if (!isAuthenticated) return null

  return (
    <div className={`edit-toolbar ${isEditMode ? 'active' : ''}`}>
      <div className="edit-toolbar-content">
        <div className="edit-toolbar-status">
          {isEditMode ? (
            <>
              <span className="status-dot active"></span>
              <span className="status-text">Modo Edicion</span>
            </>
          ) : (
            <>
              <span className="status-dot"></span>
              <span className="status-text">Admin: {user?.email}</span>
            </>
          )}
        </div>

        {isEditMode && (
          <div className="edit-toolbar-language">
            <Globe size={16} />
            <select
              value={editLanguage}
              onChange={(e) => setEditLanguage(e.target.value as 'es' | 'en')}
              className="language-select"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </div>
        )}

        <div className="edit-toolbar-actions">
          <button
            className={`toolbar-btn ${isEditMode ? 'active' : ''}`}
            onClick={toggleEditMode}
            title={isEditMode ? 'Salir del modo edicion' : 'Entrar al modo edicion'}
          >
            {isEditMode ? <X size={18} /> : <Pencil size={18} />}
            <span>{isEditMode ? 'Salir' : 'Editar'}</span>
          </button>

          <button
            className="toolbar-btn logout"
            onClick={signOut}
            title="Cerrar sesion"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {isEditMode && (
        <div className="edit-toolbar-hint">
          <span>Haz clic en cualquier texto para editarlo</span>
          <span className="hint-shortcut">Ctrl+Shift+E para salir</span>
        </div>
      )}
    </div>
  )
}
