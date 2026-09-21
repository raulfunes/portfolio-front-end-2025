"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useProjects } from "@/hooks/use-portfolio-data";
import type { Locale } from "@/lib/types";

interface ProjectsProps {
  locale?: Locale;
}

export function Projects({ locale = "es" }: ProjectsProps) {
  const { projects } = useProjects();
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
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
      { threshold: 0.15 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [projects]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "live":
        return "[ LIVE ]";
      case "development":
        return "[ DEV ]";
      case "archived":
        return "[ ARCH ]";
      default:
        return "";
    }
  };

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h2 className="projects-title">{"<"} Proyectos {"/>"}</h2>
        <p className="projects-subtitle">./mis_trabajos --list</p>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            data-index={index}
            className={`project-card ${visibleCards.has(index) ? "visible" : ""} ${hoveredProject === index ? "hovered" : ""}`}
            onMouseEnter={() => setHoveredProject(index)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <div className="project-image-container">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  width={600}
                  height={400}
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              ) : (
                <div className="project-image-placeholder" />
              )}
              <div className="project-overlay">
                <span className={`project-status ${project.status}`}>
                  {getStatusLabel(project.status)}
                </span>
                <span className="project-year">{project.year}</span>
              </div>
            </div>

            <div className="project-content">
              <h3 className="project-name">
                <span className="prompt-symbol">&gt;</span>
                {project.title}
              </h3>

              <p className="project-description">
                {locale === "en"
                  ? project.description_en ?? project.description_es
                  : project.description_es}
              </p>

              <div className="project-tech">
                {project.tech.map((t, i) => (
                  <span key={i} className="tech-badge">
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-links">
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link demo"
                  >
                    <span className="link-icon">[~]</span> Demo
                  </a>
                )}
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link github"
                  >
                    <span className="link-icon">[&lt;&gt;]</span> Codigo
                  </a>
                )}
              </div>
            </div>

            <div className="card-corner top-left"></div>
            <div className="card-corner top-right"></div>
            <div className="card-corner bottom-left"></div>
            <div className="card-corner bottom-right"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
