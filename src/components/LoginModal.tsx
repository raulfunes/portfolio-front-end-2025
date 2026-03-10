import React, { useState } from 'react'
import { X, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useEditMode } from '../contexts/EditModeContext'
import './LoginModal.css'

export function LoginModal() {
  const { signIn } = useAuth()
  const { showLoginModal, setShowLoginModal, toggleEditMode } = useEditMode()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!showLoginModal) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError('Credenciales incorrectas')
      setLoading(false)
    } else {
      setShowLoginModal(false)
      setEmail('')
      setPassword('')
      setLoading(false)
      // Activate edit mode after successful login
      toggleEditMode()
    }
  }

  const handleClose = () => {
    setShowLoginModal(false)
    setEmail('')
    setPassword('')
    setError(null)
  }

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={e => e.stopPropagation()}>
        <button className="login-modal-close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="login-modal-header">
          <Lock size={32} className="login-modal-icon" />
          <h2>Admin Access</h2>
          <p>Ingresa tus credenciales de superusuario</p>
        </div>

        <form onSubmit={handleSubmit} className="login-modal-form">
          {error && (
            <div className="login-modal-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="login-modal-field">
            <label htmlFor="email">Email</label>
            <div className="login-modal-input-wrapper">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-modal-field">
            <label htmlFor="password">Password</label>
            <div className="login-modal-input-wrapper">
              <Lock size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-modal-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <span>Acceder</span>
            )}
          </button>
        </form>

        <div className="login-modal-footer">
          <span>Ctrl + Shift + E para abrir este modal</span>
        </div>
      </div>
    </div>
  )
}
