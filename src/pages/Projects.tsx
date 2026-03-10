import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableText, EditableTextarea } from "../components/editable";
import { Plus, Trash2, Loader2 } from "lucide-react";
import "./Projects.css";

export const Projects = () => {
	const { i18n } = useTranslation();
	const lang = i18n.language as 'es' | 'en';
	const { projects, isLoading, updateProject, createProject, deleteProject } = useProjects();
	const { isEditMode } = useEditMode();
	
	const [hoveredProject, setHoveredProject] = useState<string | null>(null);
	const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
	const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const id = entry.target.getAttribute('data-id');
					if (entry.isIntersecting && id) {
						setVisibleCards((prev) => new Set(prev).add(id));
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
			case 'live': return '[ LIVE ]';
			case 'development': return '[ DEV ]';
			case 'archived': return '[ ARCH ]';
			default: return '';
		}
	};

	const handleAddProject = async () => {
		await createProject({
			title_es: 'Nuevo Proyecto',
			title_en: 'New Project',
			description_es: 'Descripcion del proyecto',
			description_en: 'Project description',
			tech: ['React'],
			image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop',
			link: null,
			github: null,
			status: 'development',
			year: new Date().getFullYear().toString(),
			sort_order: projects.length + 1
		});
	};

	const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm('¿Eliminar este proyecto?')) {
			await deleteProject(id);
		}
	};

	if (isLoading) {
		return (
			<section className="projects-section">
				<div className="projects-loading">
					<Loader2 className="spin" size={32} />
					<span>Cargando proyectos...</span>
				</div>
			</section>
		);
	}

	return (
		<section className="projects-section">
			<div className="projects-header">
				<h2 className="projects-title">{"<"} {lang === 'es' ? 'Proyectos' : 'Projects'} {"/>"}</h2>
				<p className="projects-subtitle">./mis_trabajos --list</p>
			</div>

			<div className="project-grid">
				{projects.map((project) => (
					<div
						key={project.id}
						ref={(el) => { if (el) cardRefs.current.set(project.id, el); }}
						data-id={project.id}
						className={`project-card ${visibleCards.has(project.id) ? 'visible' : ''} ${hoveredProject === project.id ? 'hovered' : ''}`}
						onMouseEnter={() => setHoveredProject(project.id)}
						onMouseLeave={() => setHoveredProject(null)}
					>
						{isEditMode && (
							<button 
								className="project-delete-btn"
								onClick={(e) => handleDeleteProject(project.id, e)}
								title="Eliminar proyecto"
							>
								<Trash2 size={16} />
							</button>
						)}

						<div className="project-image-container">
							<img 
								src={project.image || ''} 
								alt={lang === 'es' ? project.title_es : project.title_en} 
								crossOrigin="anonymous" 
							/>
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
								<EditableText
									value={lang === 'es' ? project.title_es : project.title_en}
									onSave={async (newValue) => {
										await updateProject(project.id, {
											[lang === 'es' ? 'title_es' : 'title_en']: newValue
										});
									}}
									table="projects"
									id={project.id}
									field={lang === 'es' ? 'title_es' : 'title_en'}
								/>
							</h3>
							
							<EditableTextarea
								value={lang === 'es' ? project.description_es : project.description_en}
								onSave={async (newValue) => {
									await updateProject(project.id, {
										[lang === 'es' ? 'description_es' : 'description_en']: newValue
									});
								}}
								table="projects"
								id={project.id}
								field={lang === 'es' ? 'description_es' : 'description_en'}
								className="project-description"
							/>
							
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
										<span className="link-icon">[&lt;&gt;]</span> {lang === 'es' ? 'Codigo' : 'Code'}
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

				{isEditMode && (
					<button className="project-add-card" onClick={handleAddProject}>
						<Plus size={32} />
						<span>{lang === 'es' ? 'Agregar Proyecto' : 'Add Project'}</span>
					</button>
				)}
			</div>
		</section>
	);
};
