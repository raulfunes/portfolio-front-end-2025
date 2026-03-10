import React, { useState } from "react";
import { useHeroTechs } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import "./TechBadges.css";

interface TechBadgesProps {
  className?: string;
  compact?: boolean;
}

const TechBadges: React.FC<TechBadgesProps> = ({ className = "", compact = false }) => {
  const { techs, isLoading, updateTech, createTech, deleteTech } = useHeroTechs();
  const { isEditMode } = useEditMode();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editColor, setEditColor] = useState("#ffffff");

  const handleStartEdit = (id: string, name: string, color: string) => {
    setEditingId(id);
    setEditValue(name);
    setEditColor(color);
  };

  const handleSaveEdit = async (id: string) => {
    if (editValue.trim()) {
      await updateTech(id, { name: editValue.trim(), color: editColor });
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditColor("#ffffff");
  };

  const handleAddTech = async () => {
    await createTech({
      name: "New Tech",
      color: "#22c55e",
      sort_order: techs.length + 1
    });
  };

  const handleDeleteTech = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Eliminar esta tecnología?")) {
      await deleteTech(id);
    }
  };

  if (isLoading) {
    return (
      <div className={`tech-badges ${className}`}>
        <Loader2 className="spin" size={16} />
      </div>
    );
  }

  return (
    <div className={`tech-badges ${compact ? "tech-badges-compact" : ""} ${className} ${isEditMode ? "edit-mode" : ""}`}>
      {techs.map((tech) => (
        <span
          key={tech.id}
          className={`tech-badge ${isEditMode ? "editable" : ""}`}
          style={{ "--badge-color": tech.color } as React.CSSProperties}
        >
          {editingId === tech.id ? (
            <div className="tech-badge-edit" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="tech-badge-input"
                autoFocus
              />
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                className="tech-badge-color"
              />
              <button onClick={() => handleSaveEdit(tech.id)} className="tech-badge-save">
                <Check size={12} />
              </button>
              <button onClick={handleCancelEdit} className="tech-badge-cancel">
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <span className="tech-badge-dot" />
              {tech.name}
              {isEditMode && (
                <div className="tech-badge-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(tech.id, tech.name, tech.color);
                    }}
                    className="tech-badge-edit-btn"
                  >
                    <Pencil size={10} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteTech(tech.id, e)}
                    className="tech-badge-delete-btn"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </>
          )}
        </span>
      ))}
      
      {isEditMode && (
        <button className="tech-badge-add" onClick={handleAddTech}>
          <Plus size={14} />
        </button>
      )}
    </div>
  );
};

export default TechBadges;
