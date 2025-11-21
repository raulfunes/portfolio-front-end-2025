import { useMemo } from "react";
import './Technologies.css';

type Technology = {
  area: string;
  nombre: string;
  img: string;
};

type Props = {
    technologies: Technology[];
};

export const TechnologiesSection = ({ technologies }: Props) => {
  const grouped = useMemo(() => {
    return technologies.reduce<Record<string, Technology[]>>((acc, tech) => {
      if (!acc[tech.area]) acc[tech.area] = [];
      acc[tech.area].push(tech);
      return acc;
    }, {});
  }, [technologies]);

  return (
    <section className="technologies">
      <h2>Tecnologías</h2>
      {Object.entries(grouped).map(([area, techs]) => (
        <div key={area}>
          <h3>{area}</h3>
          <div className="tech-grid">
            {techs.map((t) => (
              <div className="tech-card" key={t.nombre}>
                <img src={t.img} alt={t.nombre} />
                <span>{t.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
