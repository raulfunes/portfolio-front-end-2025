"use client";

import { useState, useEffect, useRef } from "react";
import { useExperiences } from "@/hooks/use-portfolio-data";
import type { Locale } from "@/lib/types";

interface ExperienceProps {
  locale?: Locale;
}

export function Experience({ locale = "es" }: ExperienceProps) {
  const { experiences } = useExperiences();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="experience-container">
      <div className="experience-header">
        <h2 className="retro-title">
          {"<"} {locale === "en" ? "Work Experience" : "Experiencia Laboral"} {"/>"}
        </h2>
        <p className="experience-subtitle">
          {locale === "en" ? "My professional journey" : "Mi trayectoria profesional"}
        </p>
      </div>

      <div className="experience-timeline">
        {experiences.map((exp, index) => (
          <div
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            data-index={index}
            className={`experience-card ${expandedIndex === index ? "expanded" : ""} ${visibleCards.has(index) ? "visible" : ""}`}
            onClick={() => toggleExpand(index)}
          >
            <div className="experience-card-header">
              <div className="experience-year-badge">
                <span className="pixel-border">
                  {(exp.period ?? "").split(" - ")[0]}
                </span>
              </div>
              <div className="experience-connector">
                <div className="connector-line" />
                <div className="connector-dot" />
                <div className="connector-line" />
              </div>
            </div>

            <div className="experience-card-content">
              <div className="experience-card-top">
                <div className="experience-info">
                  <h3 className="experience-title">{exp.title}</h3>
                  <h4 className="experience-company">
                    <span className="company-icon">{">"}</span>
                    {exp.company}
                  </h4>
                </div>
                <div className="experience-meta">
                  <span className="meta-badge location">{exp.location}</span>
                  <span className="meta-badge type">{exp.type}</span>
                  <span className="meta-badge duration">{exp.duration}</span>
                </div>
              </div>

              <p className="experience-description">
                {locale === "en"
                  ? exp.description_en ?? exp.description_es
                  : exp.description_es}
              </p>

              <div
                className={`experience-details ${expandedIndex === index ? "visible" : ""}`}
              >
                <div className="achievements-section">
                  <h5 className="section-title">
                    <span className="title-icon">*</span>
                    {locale === "en" ? "Key Achievements" : "Logros Destacados"}
                  </h5>
                  <ul className="achievements-list">
                    {(locale === "en"
                      ? exp.achievements_en?.length
                        ? exp.achievements_en
                        : exp.achievements_es
                      : exp.achievements_es
                    ).map((achievement, i) => (
                      <li key={i} className="achievement-item">
                        <span className="bullet">[+]</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="technologies-section">
                <div className="tech-tags">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="expand-indicator">
                <span>
                  {expandedIndex === index
                    ? locale === "en"
                      ? "[-] Collapse"
                      : "[-] Colapsar"
                    : locale === "en"
                      ? "[+] View achievements"
                      : "[+] Ver logros"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
