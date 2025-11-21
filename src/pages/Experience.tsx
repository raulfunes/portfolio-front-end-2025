import React from "react";
import "./Experience.css";

const experiences = [
	{
		title: "Frontend Developer",
		company: "TechCorp",
		period: "2022 - Presente",
		description:
			"Desarrollo de interfaces con React, implementación de diseño responsive y mantenimiento de componentes UI.",
		achivements: ["Logro 1", "Logro 2"],
		technologies: ["Tec 1", "Tec 2"],
	},
	{
		title: "Desarrollador Web Jr.",
		company: "WebStudio",
		period: "2020 - 2022",
		description:
			"Maquetación HTML/CSS, primeros pasos en JavaScript y proyectos con WordPress.",
		achivements: ["Logro 1", "Logro 2"],
		technologies: ["Tec 1", "Tec 2"],
	},
];

export const Experience = () => {
	return (
		<div className="experience-container">
			<h2>Experiencia Laboral</h2>
			<div className="experience">
				{experiences.map((exp, index) => (
					<div key={index} className="experience-item">
						<div className="experience-dot" />
						<div className="experience-content">
							<h3>{exp.title}</h3>
							<h4>{exp.company}</h4>
							<span>{exp.period}</span>
							<p>{exp.description}</p>
							<ul>
								{exp.achivements.map(achievment =>  <li key={achievment}>{achievment}</li>)}
							</ul>
							<div>
								{exp.technologies.map(technology => <p key={technology}>{technology}</p>)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
