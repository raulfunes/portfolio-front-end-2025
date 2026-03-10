import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

type EditLanguage = 'es' | 'en'

interface PendingChange {
  table: string
  id: string
  field: string
  oldValue: unknown
  newValue: unknown
}

interface EditModeContextType {
  isEditMode: boolean
  isDemoMode: boolean
  editLanguage: EditLanguage
  pendingChanges: PendingChange[]
  toggleEditMode: () => void
  enterDemoMode: () => void
  exitDemoMode: () => void
  setEditLanguage: (lang: EditLanguage) => void
  addPendingChange: (change: Omit<PendingChange, 'oldValue'> & { oldValue?: unknown }) => void
  removePendingChange: (table: string, id: string, field: string) => void
  clearPendingChanges: () => void
  hasPendingChanges: boolean
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined)

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [editLanguage, setEditLanguage] = useState<EditLanguage>('es')
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Disable edit mode if user logs out (but not if in demo mode)
  useEffect(() => {
    if (!isAuthenticated && isEditMode && !isDemoMode) {
      setIsEditMode(false)
      setPendingChanges([])
    }
  }, [isAuthenticated, isEditMode, isDemoMode])

  // Keyboard shortcut: Ctrl+Shift+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        if (isAuthenticated) {
          setIsEditMode(prev => !prev)
          setIsDemoMode(false)
        } else if (isDemoMode) {
          setIsEditMode(false)
          setIsDemoMode(false)
        } else {
          setShowLoginModal(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAuthenticated, isDemoMode])

  const toggleEditMode = useCallback(() => {
    if (isAuthenticated) {
      setIsEditMode(prev => !prev)
      setIsDemoMode(false)
    } else {
      setShowLoginModal(true)
    }
  }, [isAuthenticated])

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true)
    setIsEditMode(true)
    setShowLoginModal(false)
  }, [])

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false)
    setIsEditMode(false)
    setPendingChanges([])
  }, [])

  const addPendingChange = useCallback((change: Omit<PendingChange, 'oldValue'> & { oldValue?: unknown }) => {
    setPendingChanges(prev => {
      const filtered = prev.filter(
        c => !(c.table === change.table && c.id === change.id && c.field === change.field)
      )
      return [...filtered, change as PendingChange]
    })
  }, [])

  const removePendingChange = useCallback((table: string, id: string, field: string) => {
    setPendingChanges(prev =>
      prev.filter(c => !(c.table === table && c.id === id && c.field === field))
    )
  }, [])

  const clearPendingChanges = useCallback(() => {
    setPendingChanges([])
  }, [])

  const value: EditModeContextType = {
    isEditMode,
    isDemoMode,
    editLanguage,
    pendingChanges,
    toggleEditMode,
    enterDemoMode,
    exitDemoMode,
    setEditLanguage,
    addPendingChange,
    removePendingChange,
    clearPendingChanges,
    hasPendingChanges: pendingChanges.length > 0,
    showLoginModal,
    setShowLoginModal,
  }

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider')
  }
  return context
}
