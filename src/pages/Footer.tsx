import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useEditMode } from "../contexts/EditModeContext"
import { useContactLinks } from "../hooks/usePortfolioData"
import { Check, Pencil, Plus, Trash2, X } from "lucide-react"
import "./Footer.css"

// Map icon names → short display strings
const ICON_LABELS: Record<string, string> = {
  Mail: "[~]",
  Linkedin: "[in]",
  Github: "[gh]",
  FileDown: "[cv]",
  Link: "[lk]",
}

type EditingLink = {
  id: string
  label: string
  url: string
}

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t, i18n } = useTranslation()
  const { isEditMode, editLanguage } = useEditMode()
  const { links, updateLink, createLink, deleteLink } = useContactLinks()
  const [editing, setEditing] = useState<EditingLink | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Use active UI language for display; editLanguage only drives which field is saved
  const lang = i18n.language as "es" | "en"

  const startEdit = (id: string, url: string, label: string) => {
    setEditing({ id, url, label })
  }

  const saveEdit = async () => {
    if (!editing) return
    await updateLink(editing.id, {
      url: editing.url,
      [`label_${lang}`]: editing.label,
    })
    setEditing(null)
  }

  const cancelEdit = () => setEditing(null)

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      await deleteLink(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
    }
  }

  const addLink = async () => {
    await createLink({
      type: "other",
      url: "https://",
      label_es: "Nuevo link",
      label_en: "New link",
      icon: "Link",
      sort_order: (links.length + 1) * 10,
    })
  }

  return (
    <footer className="footer-section">
      <div className="footer-content">
          <div className="footer-terminal">
          <div className="footer-command">
            <span className="footer-prompt">$</span>
            <span className="footer-text">echo "{t('footer.thanks')}"</span>
          </div>
          <div className="footer-output">
            <span className="output-arrow">&gt;</span>
            <span>{t('footer.thanks')}</span>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Links row */}
        <div className={`footer-links${isEditMode ? " edit-mode" : ""}`}>
          {links.map((link) => {
            const label = (lang === "es" ? link.label_es : link.label_en) ?? link.type
            const iconLabel = ICON_LABELS[link.icon ?? ""] ?? "[~]"
            const isEditing = editing?.id === link.id

            if (isEditMode && isEditing) {
              return (
                <div key={link.id} className="footer-link-edit-form">
                  <div className="footer-link-edit-row">
                    <span className="link-icon">{iconLabel}</span>
                    <input
                      className="footer-link-input label"
                      value={editing.label}
                      placeholder="Label"
                      onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                    />
                  </div>
                  <div className="footer-link-edit-row">
                    <input
                      className="footer-link-input url"
                      value={editing.url}
                      placeholder="https://..."
                      onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                    />
                  </div>
                  <div className="footer-link-edit-actions">
                    <button className="footer-link-action save" onClick={saveEdit}>
                      <Check size={13} /> Guardar
                    </button>
                    <button className="footer-link-action cancel" onClick={cancelEdit}>
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )
            }

            if (isEditMode) {
              return (
                <div key={link.id} className="footer-link-wrapper">
                  <a
                    href={link.url}
                    className="footer-link"
                    onClick={(e) => e.preventDefault()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="link-icon">{iconLabel}</span>
                    {label}
                  </a>
                  <div className="footer-link-overlay">
                    <button
                      className="footer-link-overlay-btn edit"
                      title="Editar"
                      onClick={() => startEdit(link.id, link.url, label)}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      className={`footer-link-overlay-btn delete${confirmDelete === link.id ? " confirming" : ""}`}
                      title={confirmDelete === link.id ? "Click para confirmar" : "Eliminar"}
                      onClick={() => handleDelete(link.id)}
                    >
                      {confirmDelete === link.id ? <Check size={12} /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <a
                key={link.id}
                href={link.url}
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="link-icon">{iconLabel}</span>
                {label}
              </a>
            )
          })}

          {isEditMode && (
            <button className="footer-link-add" onClick={addLink}>
              <Plus size={14} /> Agregar
            </button>
          )}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            <span className="copyright-symbol">{"/*"}</span>
            {" "}{currentYear} Raul Funes - Hecho con React{" "}
            <span className="copyright-symbol">{"*/"}</span>
          </p>
          <p className="footer-status">
            <span className="status-dot"></span>
            {t('footer.available')}
          </p>
        </div>
      </div>
    </footer>
  )
}
