"use client";

import { useState, useEffect, useRef } from "react";
import { useTechnologies } from "@/hooks/use-portfolio-data";
import type { Locale } from "@/lib/types";

interface TechnologiesSectionProps {
  locale?: Locale;
}

export function TechnologiesSection({ locale = "es" }: TechnologiesSectionProps) {
  const { categories: techCategories } = useTechnologies();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [visibleBars, setVisibleBars] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeCategory && techCategories.length > 0) {
      setActiveCategory(techCategories[0].id);
    }
  }, [techCategories, activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const techName = entry.target.getAttribute("data-tech");
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

    const bars = sectionRef.current?.querySelectorAll(".skill-bar-container");
    bars?.forEach((bar) => observer.observe(bar));

    return () => observer.disconnect();
  }, [activeCategory]);

  const currentCategory = techCategories.find((c) => c.id === activeCategory);

  return (
    <section className="technologies-section" ref={sectionRef}>
      <div className="technologies-header">
        <h2 className="technologies-title">
          {"<"} {locale === "en" ? "Technologies" : "Tecnologias"} {"/>"}
        </h2>
        <p className="technologies-subtitle">
          {"cat skills.json | jq '.technologies'"}
        </p>
      </div>

      <div className="category-tabs">
        {techCategories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(category.id);
              setVisibleBars(new Set());
            }}
          >
            <span className="tab-icon">{category.icon}</span>
            <span className="tab-title">
              {locale === "en" ? category.name_en : category.name_es}
            </span>
          </button>
        ))}
      </div>

      <div className="skills-container">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot dot-red"></span>
            <span className="terminal-dot dot-yellow"></span>
            <span className="terminal-dot dot-green"></span>
            <span className="terminal-title">
              skills --category={activeCategory}
            </span>
          </div>

          <div className="terminal-body">
            <div className="terminal-output">
              <span className="output-prefix">$</span>
              <span className="output-text">
                {locale === "en" ? "Showing skills for" : "Mostrando habilidades de"}{" "}
                {locale === "en"
                  ? currentCategory?.name_en
                  : currentCategory?.name_es}
                ...
              </span>
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
                    <div className="skill-bar-bg">
                      <div
                        className={`skill-bar-fill ${visibleBars.has(`${activeCategory}-${tech.name}`) ? "animated" : ""}`}
                        style={
                          {
                            "--fill-width": `${tech.level}%`,
                            "--fill-color": tech.color,
                          } as React.CSSProperties
                        }
                      ></div>
                    </div>
                    <div className="skill-bar-blocks">
                      {[...Array(10)].map((_, i) => (
                        <span
                          key={i}
                          className={`bar-block ${i < Math.floor(tech.level / 10) ? "filled" : ""}`}
                          style={
                            {
                              "--block-color": tech.color,
                              animationDelay: `${i * 0.05}s`,
                            } as React.CSSProperties
                          }
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
}
