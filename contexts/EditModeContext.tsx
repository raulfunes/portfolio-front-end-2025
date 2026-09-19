"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"

interface EditModeContextValue {
  isAdmin: boolean
  editMode: boolean
  toggleEditMode: () => void
  setEditMode: (v: boolean) => void
}

const EditModeContext = createContext<EditModeContextValue>({
  isAdmin: false,
  editMode: false,
  toggleEditMode: () => {},
  setEditMode: () => {},
})

export function EditModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [editMode, setEditMode] = useState(false)

  const isAdmin = user?.user_metadata?.is_admin === true

  const toggleEditMode = () => setEditMode((v) => !v)

  return (
    <EditModeContext.Provider value={{ isAdmin, editMode, toggleEditMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  return useContext(EditModeContext)
}
