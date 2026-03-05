import { useState, useEffect, useRef } from "react";
import './Technologies.css';

type Technology = {
  name: string;
  level: number;
  color: string;
};

type TechCategory = {
  id: string;
  title: string;
  icon: string;
  technologies: Technology[];
};

const techCategories: TechCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    icon: "[>_]",
    technologies: [
      { name: "React", level: 90, color: "#61DAFB" },
      { name: "TypeScript", level: 85, color: "#3178C6" },
      { name: "Next.js", level: 80, color: "#ffffff" },
      { name: "Tailwind CSS", level: 85, color: "#06B6D4" },
      { name: "Vue.js", level: 70, color: "#4FC08D" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    icon: "[~/]",
    technologies: [
      { name: "Node.js", level: 85, color: "#68A063" },
      { name: "Python", level: 75, color: "#3776AB" },
      { name: "Express", level: 80, color: "#ffffff" },
      { name: "PostgreSQL", level: 75, color: "#4169E1" },
      { name: "MongoDB", level: 70, color: "#47A248" },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    icon: "[#!]",
    technologies: [
      { name: "Git", level: 90, color: "#F05032" },
      { name: "Docker", level: 75, color: "#2496ED" },
      { name: "AWS", level: 65, color: "#FF9900" },
      { name: "Linux", level: 70, color: "#FCC624" },
      { name: "CI/CD", level: 70, color: "#22c55e" },
    ],
  },
];

export const TechnologiesSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("frontend");
  const [visibleBars, setVisibleBars] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

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
  }, [activeCategory]);

  const currentCategory = techCategories.find((c) => c.id === activeCategory);

  return (
    <section className="technologies-section" ref={sectionRef}>
      <div className="technologies-header">
        <h2 className="technologies-title">{"<"} Tecnologias {"/>"}</h2>
        <p className="technologies-subtitle">cat skills.json | jq '.technologies'</p>
      </div>

      <div className="category-tabs">
        {techCategories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(category.id);
              setVisibleBars(new Set());
            }}
          >
            <span className="tab-icon">{category.icon}</span>
            <span className="tab-title">{category.title}</span>
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
              <span className="output-text">Mostrando habilidades de {currentCategory?.title}...</span>
            </div>

            <div className="skills-list">
              {currentCategory?.technologies.map((tech, index) => (
                <div
                  key={tech.name}
                  className="skill-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="skill-header">
                    <span className="skill-name" style={{ color: tech.color }}>
                      {tech.name}
                    </span>
                    <span className="skill-level">{tech.level}%</span>
                  </div>
                  
                  <div 
                    className="skill-bar-container" 
                    data-tech={`${activeCategory}-${tech.name}`}
                  >
                    <div 
                      className="skill-bar-bg"
                    >
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
