import React, { useState } from "react";
import "./Experience.css";

const experiences = [
	{
		title: "Frontend Developer",
		company: "TechCorp",
		period: "2022 - Presente",
		duration: "2+ anos",
		type: "Tiempo completo",
		location: "Remoto",
		description:
			"Desarrollo de interfaces modernas con React, implementacion de diseno responsive y mantenimiento de componentes UI reutilizables para aplicaciones de alto trafico.",
		achievements: [
			"Reduci el tiempo de carga en un 40% optimizando componentes",
			"Implemente sistema de design tokens usado por 5 equipos",
			"Lidere migracion de JavaScript a TypeScript",
		],
		technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux"],
	},
	{
		title: "Desarrollador Web Jr.",
		company: "WebStudio",
		period: "2020 - 2022",
		duration: "2 anos",
		type: "Tiempo completo",
		location: "Hibrido",
		description:
			"Maquetacion HTML/CSS, desarrollo JavaScript y creacion de sitios con WordPress para clientes de diversos sectores.",
		achievements: [
			"Desarrolle +15 sitios web para clientes",
			"Automatice procesos de deploy reduciendo errores un 60%",
			"Cree plantillas reutilizables para acelerar entregas",
		],
		technologies: ["HTML", "CSS", "JavaScript", "WordPress", "PHP"],
	},
];

export const Experience = () => {
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

	const toggleExpand = (index: number) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};

	return (
		<div className="experience-container">
			<div className="experience-header">
				<h2 className="retro-title">{"<"} Experiencia Laboral {"/>"}</h2>
				<p className="experience-subtitle">Mi trayectoria profesional</p>
			</div>
			
			<div className="experience-timeline">
				{experiences.map((exp, index) => (
					<div 
						key={index} 
						className={`experience-card ${expandedIndex === index ? 'expanded' : ''}`}
						onClick={() => toggleExpand(index)}
					>
						<div className="experience-card-header">
							<div className="experience-year-badge">
								<span className="pixel-border">{exp.period.split(' - ')[0]}</span>
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
							
							<p className="experience-description">{exp.description}</p>
							
							<div className={`experience-details ${expandedIndex === index ? 'visible' : ''}`}>
								<div className="achievements-section">
									<h5 className="section-title">
										<span className="title-icon">*</span>
										Logros Destacados
									</h5>
									<ul className="achievements-list">
										{exp.achievements.map((achievement, i) => (
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
										<span key={i} className="tech-tag">{tech}</span>
									))}
								</div>
							</div>
							
							<div className="expand-indicator">
								<span>{expandedIndex === index ? '[-] Colapsar' : '[+] Ver logros'}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
