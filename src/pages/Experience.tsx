import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useExperiences } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableText, EditableTextarea, EditableArray } from "../components/editable";
import { Plus, Trash2, Loader2 } from "lucide-react";
import "./Experience.css";

export const Experience = () => {
	const { i18n } = useTranslation();
	const lang = i18n.language as 'es' | 'en';
	const { experiences, isLoading, updateExperience, createExperience, deleteExperience } = useExperiences();
	const { isEditMode } = useEditMode();

	const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
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
			{ threshold: 0.2 }
		);

		cardRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => observer.disconnect();
	}, [experiences]);

	const toggleExpand = (id: string) => {
		setExpandedIndex(expandedIndex === id ? null : id);
	};

	const handleAddExperience = async () => {
		await createExperience({
			title_es: 'Nuevo Puesto',
			title_en: 'New Position',
			company: 'Empresa',
			period: `${new Date().getFullYear()} - Presente`,
			duration_es: '0 anos',
			duration_en: '0 years',
			type_es: 'Tiempo completo',
			type_en: 'Full-time',
			location_es: 'Remoto',
			location_en: 'Remote',
			description_es: 'Descripcion del puesto',
			description_en: 'Position description',
			achievements_es: ['Logro 1'],
			achievements_en: ['Achievement 1'],
			technologies: ['React'],
			sort_order: experiences.length + 1
		});
	};

	const handleDeleteExperience = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm('¿Eliminar esta experiencia?')) {
			await deleteExperience(id);
		}
	};

	if (isLoading) {
		return (
			<div className="experience-container">
				<div className="experience-loading">
					<Loader2 className="spin" size={32} />
					<span>Cargando experiencia...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="experience-container">
			<div className="experience-header">
				<h2 className="retro-title">{"<"} {lang === 'es' ? 'Experiencia Laboral' : 'Work Experience'} {"/>"}</h2>
				<p className="experience-subtitle">{lang === 'es' ? 'Mi trayectoria profesional' : 'My professional journey'}</p>
			</div>
			
			<div className="experience-timeline">
				{experiences.map((exp) => (
					<div 
						key={exp.id}
						ref={(el) => { if (el) cardRefs.current.set(exp.id, el); }}
						data-id={exp.id}
						className={`experience-card ${expandedIndex === exp.id ? 'expanded' : ''} ${visibleCards.has(exp.id) ? 'visible' : ''}`}
						onClick={() => toggleExpand(exp.id)}
					>
						{isEditMode && (
							<button 
								className="experience-delete-btn"
								onClick={(e) => handleDeleteExperience(exp.id, e)}
								title="Eliminar experiencia"
							>
								<Trash2 size={16} />
							</button>
						)}

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
									<h3 className="experience-title">
										<EditableText
											value={lang === 'es' ? exp.title_es : exp.title_en}
											onSave={async (newValue) => {
												await updateExperience(exp.id, {
													[lang === 'es' ? 'title_es' : 'title_en']: newValue
												});
											}}
											table="experiences"
											id={exp.id}
											field={lang === 'es' ? 'title_es' : 'title_en'}
										/>
									</h3>
									<h4 className="experience-company">
										<span className="company-icon">{">"}</span>
										<EditableText
											value={exp.company}
											onSave={async (newValue) => {
												await updateExperience(exp.id, { company: newValue });
											}}
											table="experiences"
											id={exp.id}
											field="company"
										/>
									</h4>
								</div>
								<div className="experience-meta">
									<span className="meta-badge location">
										{lang === 'es' ? exp.location_es : exp.location_en}
									</span>
									<span className="meta-badge type">
										{lang === 'es' ? exp.type_es : exp.type_en}
									</span>
									<span className="meta-badge duration">
										{lang === 'es' ? exp.duration_es : exp.duration_en}
									</span>
								</div>
							</div>
							
							<EditableTextarea
								value={lang === 'es' ? exp.description_es : exp.description_en}
								onSave={async (newValue) => {
									await updateExperience(exp.id, {
										[lang === 'es' ? 'description_es' : 'description_en']: newValue
									});
								}}
								table="experiences"
								id={exp.id}
								field={lang === 'es' ? 'description_es' : 'description_en'}
								className="experience-description"
							/>
							
							<div className={`experience-details ${expandedIndex === exp.id ? 'visible' : ''}`}>
								<div className="achievements-section">
									<h5 className="section-title">
										<span className="title-icon">*</span>
										{lang === 'es' ? 'Logros Destacados' : 'Key Achievements'}
									</h5>
									<EditableArray
										values={lang === 'es' ? exp.achievements_es : exp.achievements_en}
										onSave={async (newValues) => {
											await updateExperience(exp.id, {
												[lang === 'es' ? 'achievements_es' : 'achievements_en']: newValues
											});
										}}
										table="experiences"
										id={exp.id}
										field={lang === 'es' ? 'achievements_es' : 'achievements_en'}
										className="achievements-list"
										itemClassName="achievement-item"
										renderItem={(item) => (
											<>
												<span className="bullet">[+]</span>
												{item}
											</>
										)}
									/>
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
								<span>{expandedIndex === exp.id 
									? (lang === 'es' ? '[-] Colapsar' : '[-] Collapse')
									: (lang === 'es' ? '[+] Ver logros' : '[+] View achievements')
								}</span>
							</div>
						</div>
					</div>
				))}

				{isEditMode && (
					<button className="experience-add-card" onClick={handleAddExperience}>
						<Plus size={32} />
						<span>{lang === 'es' ? 'Agregar Experiencia' : 'Add Experience'}</span>
					</button>
				)}
			</div>
		</div>
	);
};
