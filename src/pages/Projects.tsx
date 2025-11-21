import { useState } from "react";
import "./Projects.css";

const projects = [
	{
		title: "Mi Portafolio",
		tech: ["React", "CSS", "i18n"],
		description:
			"Una web personal con dark mode, selector de idioma y animaciones.",
		image: "https://www.esdesignbarcelona.com/sites/default/files/img/6_pasos_para_crear_un_portfolio_digital_y_todo_lo_que_debe_incluir_2.png",
		link: "https://miportafolio.com",
	},
	{
		title: "Mi Portafolio",
		tech: ["React", "CSS", "i18n"],
		description:
			"Una web personal con dark mode, selector de idioma y animaciones.",
		image: "https://www.esdesignbarcelona.com/sites/default/files/img/6_pasos_para_crear_un_portfolio_digital_y_todo_lo_que_debe_incluir_2.png",
		link: "https://miportafolio.com",
	},
	{
		title: "Mi Portafolio",
		tech: ["React", "CSS", "i18n"],
		description:
			"Una web personal con dark mode, selector de idioma y animaciones.",
		image: "https://www.esdesignbarcelona.com/sites/default/files/img/6_pasos_para_crear_un_portfolio_digital_y_todo_lo_que_debe_incluir_2.png",
		link: "https://miportafolio.com",
	},
	{
		title: "Mi Portafolio",
		tech: ["React", "CSS", "i18n"],
		description:
			"Una web personal con dark mode, selector de idioma y animaciones.",
		image: "https://www.esdesignbarcelona.com/sites/default/files/img/6_pasos_para_crear_un_portfolio_digital_y_todo_lo_que_debe_incluir_2.png",
		link: "https://miportafolio.com",
	},
];

export const Projects = () => {
	const [selectedProject, setSelectedProject] = useState(null);

	return (
		<section className="projects">
			<h2>Proyectos</h2>
			{selectedProject && 
				<div className="selected-project">

				</div>
			}

			<div className="project-grid">
				{projects.map((p, i) => (
					<div className="project-card" key={i}>
						<img src={p.image} alt={p.title} />
						<h3>{p.title}</h3>
						<p>{p.description}</p>
						<p>{p.tech.join(", ")}</p>
						<a href={p.link} target="_blank" rel="noopener noreferrer">
							Ver proyecto
						</a>
					</div>
				))}
			</div>
		</section>
	)
};
