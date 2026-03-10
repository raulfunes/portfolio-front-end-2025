import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTechnologies } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableText } from "../components/editable";
import { Plus, Trash2, Loader2, Pencil, Check, X, Settings2 } from "lucide-react";
import './Technologies.css';

// Icons supported for categories
const ICON_OPTIONS = ['L', 'S', 'W', 'B', 'T', 'D', 'C', 'R', 'M', 'A', 'G', 'P'];

export const TechnologiesSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'es' | 'en';
  const {
    categories,
    isLoading,
    updateTechnology,
    createTechnology,
    deleteTechnology,
    updateCategory,
    createCategory,
    deleteCategory,
  } = useTechnologies();
  const { isEditMode } = useEditMode();

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [visibleBars, setVisibleBars] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  // Editing state for categories
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatEs, setEditCatEs] = useState("");
  const [editCatEn, setEditCatEn] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("L");
  const [showCatManager, setShowCatManager] = useState(false);

  // Set initial category when data loads
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    // Close cat manager when leaving edit mode
    if (!isEditMode) setShowCatManager(false);
  }, [isEditMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const techName = entry.target.getAttribute('data-tech');
            if (techName) {
              setTimeout(() => {
                setVisibleBars((prev) => new Set(prev).add(techName));
              }, 100);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const bars = sectionRef.current?.querySelectorAll('.skill-bar-container');
    bars?.forEach((bar) => observer.observe(bar));

    return () => observer.disconnect();
  }, [activeCategory, categories]);

  const currentCategory = categories.find((c) => c.slug === activeCategory);

  // --- Category handlers ---
  const startEditCat = (cat: typeof categories[0]) => {
    setEditingCatId(cat.id);
    setEditCatEs(cat.title_es);
    setEditCatEn(cat.title_en);
    setEditCatIcon(cat.icon);
  };

  const saveCat = async (id: string) => {
    await updateCategory(id, {
      title_es: editCatEs,
      title_en: editCatEn,
      icon: editCatIcon,
    });
    setEditingCatId(null);
  };

  const handleAddCategory = async () => {
    const newSlug = `category-${Date.now()}`;
    await createCategory({
      slug: newSlug,
      title_es: 'Nueva Categoria',
      title_en: 'New Category',
      icon: 'C',
      sort_order: categories.length + 1,
    });
    setActiveCategory(newSlug);
  };

  const handleDeleteCategory = async (id: string, slug: string) => {
    if (!confirm(lang === 'es' ? '¿Eliminar esta categoria y todas sus tecnologias?' : 'Delete this category and all its technologies?')) return;
    await deleteCategory(id);
    if (activeCategory === slug) {
      setActiveCategory(categories[0]?.slug ?? "");
    }
  };

  // --- Technology handlers ---
  const handleAddTechnology = async () => {
    if (!currentCategory) return;
    await createTechnology({
      category_id: currentCategory.id,
      name: 'Nueva Tecnologia',
      level: 50,
      color: '#ffffff',
      sort_order: (currentCategory.technologies?.length || 0) + 1,
    });
  };

  const handleDeleteTechnology = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(lang === 'es' ? '¿Eliminar esta tecnologia?' : 'Delete this technology?')) {
      await deleteTechnology(id);
    }
  };

  const handleLevelChange = async (id: string, newLevel: number) => {
    await updateTechnology(id, { level: Math.max(0, Math.min(100, newLevel)) });
  };

  if (isLoading) {
    return (
      <section className="technologies-section">
        <div className="technologies-loading">
          <Loader2 className="spin" size={32} />
          <span>Cargando tecnologias...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="technologies-section" ref={sectionRef}>
      <div className="technologies-header">
        <h2 className="technologies-title">{"<"} {lang === 'es' ? 'Tecnologias' : 'Technologies'} {"/>"}</h2>
        <p className="technologies-subtitle">cat skills.json | jq '.technologies'</p>
      </div>

      {/* Category tabs row */}
      <div className="category-tabs-wrapper">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory === category.slug ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(category.slug);
                setVisibleBars(new Set());
              }}
            >
              <span className="tab-icon">[{category.icon.charAt(0)}]</span>
              <span className="tab-title">{lang === 'es' ? category.title_es : category.title_en}</span>
            </button>
          ))}
        </div>

        {/* Manage categories button */}
        {isEditMode && (
          <button
            className={`cat-manage-btn ${showCatManager ? 'active' : ''}`}
            onClick={() => setShowCatManager((v) => !v)}
            title={lang === 'es' ? 'Gestionar categorias' : 'Manage categories'}
          >
            <Settings2 size={16} />
            <span>{lang === 'es' ? 'Categorias' : 'Categories'}</span>
          </button>
        )}
      </div>

      {/* Category manager panel */}
      {isEditMode && showCatManager && (
        <div className="cat-manager-panel">
          <div className="cat-manager-header">
            <span>{lang === 'es' ? 'Gestionar categorias' : 'Manage categories'}</span>
            <button className="cat-manager-close" onClick={() => setShowCatManager(false)}>
              <X size={14} />
            </button>
          </div>

          <div className="cat-manager-list">
            {categories.map((cat) => (
              <div key={cat.id} className="cat-manager-item">
                {editingCatId === cat.id ? (
                  /* Edit form */
                  <div className="cat-edit-form">
                    <div className="cat-edit-fields">
                      <input
                        className="cat-edit-input"
                        value={editCatEs}
                        onChange={(e) => setEditCatEs(e.target.value)}
                        placeholder="Nombre ES"
                      />
                      <input
                        className="cat-edit-input"
                        value={editCatEn}
                        onChange={(e) => setEditCatEn(e.target.value)}
                        placeholder="Name EN"
                      />
                      <div className="cat-icon-picker">
                        <span className="cat-icon-label">Icon:</span>
                        {ICON_OPTIONS.map((ic) => (
                          <button
                            key={ic}
                            className={`cat-icon-opt ${editCatIcon === ic ? 'selected' : ''}`}
                            onClick={() => setEditCatIcon(ic)}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="cat-edit-actions">
                      <button className="cat-action save" onClick={() => saveCat(cat.id)}>
                        <Check size={14} /> {lang === 'es' ? 'Guardar' : 'Save'}
                      </button>
                      <button className="cat-action cancel" onClick={() => setEditingCatId(null)}>
                        <X size={14} /> {lang === 'es' ? 'Cancelar' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Read row */
                  <>
                    <span className="cat-item-icon">[{cat.icon.charAt(0)}]</span>
                    <span className="cat-item-name">{lang === 'es' ? cat.title_es : cat.title_en}</span>
                    <span className="cat-item-count">{cat.technologies?.length ?? 0} items</span>
                    <div className="cat-item-actions">
                      <button className="cat-action edit" onClick={() => startEditCat(cat)} title="Editar">
                        <Pencil size={13} />
                      </button>
                      <button className="cat-action delete" onClick={() => handleDeleteCategory(cat.id, cat.slug)} title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <button className="cat-add-btn" onClick={handleAddCategory}>
            <Plus size={15} />
            <span>{lang === 'es' ? 'Nueva categoria' : 'New category'}</span>
          </button>
        </div>
      )}

      {/* Skills terminal */}
      <div className="skills-container">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">skills --category={activeCategory}</span>
          </div>
          
          <div className="terminal-body">
            <div className="terminal-output">
              <span className="output-prefix">$</span>
              <span className="output-text">
                {lang === 'es' ? 'Mostrando habilidades de' : 'Showing skills for'}{' '}
                {currentCategory ? (lang === 'es' ? currentCategory.title_es : currentCategory.title_en) : ''}...
              </span>
            </div>

            <div className="skills-list">
              {currentCategory?.technologies.map((tech, index) => (
                <div
                  key={tech.id}
                  className="skill-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="skill-header">
                    <span className="skill-name" style={{ color: tech.color }}>
                      <EditableText
                        value={tech.name}
                        onSave={async (newValue) => {
                          await updateTechnology(tech.id, { name: newValue });
                        }}
                        table="technologies"
                        id={tech.id}
                        field="name"
                      />
                    </span>
                    <div className="skill-level-wrapper">
                      {isEditMode ? (
                        <input
                          type="number"
                          value={tech.level}
                          onChange={(e) => handleLevelChange(tech.id, parseInt(e.target.value) || 0)}
                          className="skill-level-input"
                          min={0}
                          max={100}
                        />
                      ) : (
                        <span className="skill-level">{tech.level}%</span>
                      )}
                      {isEditMode && (
                        <button
                          className="skill-delete-btn"
                          onClick={(e) => handleDeleteTechnology(tech.id, e)}
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div
                    className="skill-bar-container"
                    data-tech={`${activeCategory}-${tech.name}`}
                  >
                    <div className="skill-bar-bg">
                      <div
                        className={`skill-bar-fill ${visibleBars.has(`${activeCategory}-${tech.name}`) ? 'animated' : ''}`}
                        style={{
                          '--fill-width': `${tech.level}%`,
                          '--fill-color': tech.color,
                        } as React.CSSProperties}
                      ></div>
                    </div>
                    <div className="skill-bar-blocks">
                      {[...Array(10)].map((_, i) => (
                        <span
                          key={i}
                          className={`bar-block ${i < Math.floor(tech.level / 10) ? 'filled' : ''}`}
                          style={{
                            '--block-color': tech.color,
                            animationDelay: `${i * 0.05}s`,
                          } as React.CSSProperties}
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {isEditMode && (
                <button className="skill-add-btn" onClick={handleAddTechnology}>
                  <Plus size={16} />
                  <span>{lang === 'es' ? 'Agregar Tecnologia' : 'Add Technology'}</span>
                </button>
              )}
            </div>

            <div className="terminal-cursor">
              <span className="cursor-prefix">&gt;</span>
              <span className="cursor-blink">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
