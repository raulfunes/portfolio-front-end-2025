import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTechnologies } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableText } from "../components/editable";
import { Plus, Trash2, Loader2 } from "lucide-react";
import './Technologies.css';

export const TechnologiesSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'es' | 'en';
  const { categories, isLoading, updateTechnology, createTechnology, deleteTechnology } = useTechnologies();
  const { isEditMode } = useEditMode();

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [visibleBars, setVisibleBars] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  // Set initial category when data loads
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].slug);
    }
  }, [categories, activeCategory]);

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

  const handleAddTechnology = async () => {
    if (!currentCategory) return;
    await createTechnology({
      category_id: currentCategory.id,
      name: 'Nueva Tecnologia',
      level: 50,
      color: '#ffffff',
      sort_order: (currentCategory.technologies?.length || 0) + 1
    });
  };

  const handleDeleteTechnology = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta tecnologia?')) {
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
                {lang === 'es' ? 'Mostrando habilidades de' : 'Showing skills for'} {currentCategory ? (lang === 'es' ? currentCategory.title_es : currentCategory.title_en) : ''}...
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
                            animationDelay: `${i * 0.05}s`
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
