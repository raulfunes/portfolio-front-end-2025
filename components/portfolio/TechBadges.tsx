const techs = [
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#68A063" },
  { name: "Python", color: "#3776AB" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Docker", color: "#2496ED" },
  { name: "AWS", color: "#FF9900" },
  { name: "Git", color: "#F05032" },
];

interface TechBadgesProps {
  className?: string;
  compact?: boolean;
}

export function TechBadges({ className = "", compact = false }: TechBadgesProps) {
  return (
    <div className={`tech-badges ${compact ? "tech-badges-compact" : ""} ${className}`}>
      {techs.map((tech) => (
        <span
          key={tech.name}
          className="tech-badge"
          style={{ "--badge-color": tech.color } as React.CSSProperties}
        >
          <span className="tech-badge-dot" />
          {tech.name}
        </span>
      ))}
    </div>
  );
}
