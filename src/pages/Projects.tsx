import { useState, useEffect, useRef } from "react";
import "./Projects.css";

const projects = [
	{
		id: 1,
		title: "Portfolio Personal",
		tech: ["React", "TypeScript", "CSS", "i18n"],
		description:
			"Web personal con tema oscuro, selector de idioma, animaciones fluidas y diseno retro inspirado en terminales.",
		image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop",
		link: "https://miportafolio.com",
		github: "https://github.com/raulfunes/portfolio",
		status: "live",
		year: "2024",
	},
	{
		id: 2,
		title: "Task Manager CLI",
		tech: ["Node.js", "MongoDB", "Express", "JWT"],
		description:
			"API REST para gestion de tareas con autenticacion, roles de usuario y documentacion Swagger.",
		image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
		link: "https://taskmanager-api.com",
		github: "https://github.com/raulfunes/task-manager",
		status: "live",
		year: "2024",
	},
	{
		id: 3,
		title: "E-commerce Dashboard",
		tech: ["Next.js", "Tailwind", "Prisma", "PostgreSQL"],
		description:
			"Panel de administracion para tiendas online con analytics en tiempo real y gestion de inventario.",
		image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
		link: "https://ecommerce-dash.com",
		github: "https://github.com/raulfunes/ecommerce-dashboard",
		status: "development",
		year: "2023",
	},
	{
		id: 4,
		title: "Weather Station",
		tech: ["Python", "Raspberry Pi", "Flask", "Chart.js"],
		description:
			"Sistema IoT que recopila datos meteorologicos y los visualiza en una interfaz web interactiva.",
		image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
		link: null,
		github: "https://github.com/raulfunes/weather-station",
		status: "archived",
		year: "2023",
	},
];

export const Projects = () => {
	const [hoveredProject, setHoveredProject] = useState<number | null>(null);
	const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
	const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = Number(entry.target.getAttribute('data-index'));
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
	}, []);

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'live': return '[ LIVE ]';
			case 'development': return '[ DEV ]';
			case 'archived': return '[ ARCH ]';
			default: return '';
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
						ref={(el) => { cardRefs.current[index] = el; }}
						data-index={index}
						className={`project-card ${visibleCards.has(index) ? 'visible' : ''} ${hoveredProject === index ? 'hovered' : ''}`}
						onMouseEnter={() => setHoveredProject(index)}
						onMouseLeave={() => setHoveredProject(null)}
					>
						<div className="project-image-container">
							<img src={project.image} alt={project.title} crossOrigin="anonymous" />
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
							
							<p className="project-description">{project.description}</p>
							
							<div className="project-tech">
								{project.tech.map((t, i) => (
									<span key={i} className="tech-badge">{t}</span>
								))}
							</div>

							<div className="project-links">
								{project.link && (
									<a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link demo">
										<span className="link-icon">[~]</span> Demo
									</a>
								)}
								{project.github && (
									<a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link github">
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
};
