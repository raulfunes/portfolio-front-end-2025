import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useExperiences } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableText, EditableTextarea, EditableArray } from "../components/editable";
import { Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import "./Experience.css";

// Small inline editable badge for meta fields
const EditableBadge = ({
	value,
	onSave,
	className,
}: {
	value: string;
	onSave: (v: string) => Promise<void>;
	className?: string;
}) => {
	const { isEditMode } = useEditMode();
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);

	const save = async () => {
		if (draft.trim() && draft !== value) await onSave(draft.trim());
		setEditing(false);
	};

	const cancel = () => {
		setDraft(value);
		setEditing(false);
	};

	if (!isEditMode) return <span className={`meta-badge ${className ?? ""}`}>{value}</span>;

	if (editing) {
		return (
			<span className={`meta-badge ${className ?? ""} meta-badge-editing`} onClick={(e) => e.stopPropagation()}>
				<input
					autoFocus
					className="meta-badge-input"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") save();
						if (e.key === "Escape") cancel();
					}}
				/>
				<button className="meta-badge-action save" onClick={save}><Check size={12} /></button>
				<button className="meta-badge-action cancel" onClick={cancel}><X size={12} /></button>
			</span>
		);
	}

	return (
		<span
			className={`meta-badge ${className ?? ""} meta-badge-editable`}
			onClick={(e) => { e.stopPropagation(); setEditing(true); }}
			title="Clic para editar"
		>
			{value}
			<Pencil size={10} className="meta-badge-pencil" />
		</span>
	);
};

// Inline editable tech tags for the experience card
const EditableTechTags = ({
	technologies,
	onSave,
}: {
	technologies: string[];
	onSave: (techs: string[]) => Promise<void>;
}) => {
	const { isEditMode } = useEditMode();
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [draft, setDraft] = useState("");
	const [adding, setAdding] = useState(false);
	const [newTech, setNewTech] = useState("");

	const saveEdit = async (index: number) => {
		if (draft.trim()) {
			const updated = [...technologies];
			updated[index] = draft.trim();
			await onSave(updated);
		}
		setEditingIndex(null);
		setDraft("");
	};

	const deleteTag = async (index: number, e: React.MouseEvent) => {
		e.stopPropagation();
		const updated = technologies.filter((_, i) => i !== index);
		await onSave(updated);
	};

	const addTag = async () => {
		if (newTech.trim()) {
			await onSave([...technologies, newTech.trim()]);
			setNewTech("");
			setAdding(false);
		}
	};

	return (
		<div className="technologies-section" onClick={(e) => e.stopPropagation()}>
			<div className="tech-tags">
				{technologies.map((tech, i) => {
					if (isEditMode && editingIndex === i) {
						return (
							<span key={i} className="tech-tag tech-tag-editing">
								<input
									autoFocus
									className="tech-tag-input"
									value={draft}
									onChange={(e) => setDraft(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") saveEdit(i);
										if (e.key === "Escape") { setEditingIndex(null); setDraft(""); }
									}}
								/>
								<button className="tech-tag-action save" onClick={() => saveEdit(i)}><Check size={11} /></button>
								<button className="tech-tag-action cancel" onClick={() => { setEditingIndex(null); setDraft(""); }}><X size={11} /></button>
							</span>
						);
					}
					return (
						<span
							key={i}
							className={`tech-tag ${isEditMode ? "tech-tag-editable" : ""}`}
							onClick={() => {
								if (isEditMode) { setEditingIndex(i); setDraft(tech); }
							}}
						>
							{tech}
							{isEditMode && (
								<button className="tech-tag-delete" onClick={(e) => deleteTag(i, e)} title="Eliminar">
									<X size={10} />
								</button>
							)}
						</span>
					);
				})}

				{isEditMode && !adding && (
					<button className="tech-tag tech-tag-add" onClick={() => setAdding(true)}>
						<Plus size={13} /> Add
					</button>
				)}

				{isEditMode && adding && (
					<span className="tech-tag tech-tag-editing">
						<input
							autoFocus
							className="tech-tag-input"
							placeholder="React..."
							value={newTech}
							onChange={(e) => setNewTech(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") addTag();
								if (e.key === "Escape") { setAdding(false); setNewTech(""); }
							}}
						/>
						<button className="tech-tag-action save" onClick={addTag}><Check size={11} /></button>
						<button className="tech-tag-action cancel" onClick={() => { setAdding(false); setNewTech(""); }}><X size={11} /></button>
					</span>
				)}
			</div>
		</div>
	);
};

export const Experience = () => {
	const { i18n } = useTranslation();
	const lang = i18n.language as "es" | "en";
	const { experiences, isLoading, updateExperience, createExperience, deleteExperience } = useExperiences();
	const { isEditMode } = useEditMode();

	const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
	const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());
	const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const id = entry.target.getAttribute("data-id");
					if (entry.isIntersecting && id) {
						setVisibleCards((prev) => new Set(prev).add(id));
					}
				});
			},
			{ threshold: 0.2 }
		);
		cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
		return () => observer.disconnect();
	}, [experiences]);

	const toggleExpand = (id: string) => {
		if (isEditMode) return; // don't collapse in edit mode
		setExpandedIndex(expandedIndex === id ? null : id);
	};

	const handleAddExperience = async () => {
		await createExperience({
			title_es: "Nuevo Puesto",
			title_en: "New Position",
			company: "Empresa",
			period: `${new Date().getFullYear()} - Presente`,
			duration_es: "0 anos",
			duration_en: "0 years",
			type_es: "Tiempo completo",
			type_en: "Full-time",
			location_es: "Remoto",
			location_en: "Remote",
			description_es: "Descripcion del puesto",
			description_en: "Position description",
			achievements_es: ["Logro 1"],
			achievements_en: ["Achievement 1"],
			technologies: ["React"],
			sort_order: experiences.length + 1,
		});
	};

	const handleDeleteExperience = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm("¿Eliminar esta experiencia?")) {
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
				<h2 className="retro-title">
					{"<"} {lang === "es" ? "Experiencia Laboral" : "Work Experience"} {"/>"}
				</h2>
				<p className="experience-subtitle">
					{lang === "es" ? "Mi trayectoria profesional" : "My professional journey"}
				</p>
			</div>

			<div className="experience-timeline">
				{experiences.map((exp) => {
					// In edit mode always expanded; otherwise controlled by expandedIndex
					const isExpanded = isEditMode || expandedIndex === exp.id;

					return (
						<div
							key={exp.id}
							ref={(el) => { if (el) cardRefs.current.set(exp.id, el); }}
							data-id={exp.id}
							className={`experience-card ${isExpanded ? "expanded" : ""} ${visibleCards.has(exp.id) ? "visible" : ""}`}
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
								{/* Year badge — editable: it's the start year from the period */}
								<div className="experience-year-badge" onClick={(e) => e.stopPropagation()}>
									<EditableBadge
										className="year-badge-inner"
										value={exp.period.split(" - ")[0]}
										onSave={async (newYear) => {
											const parts = exp.period.split(" - ");
											const end = parts[1] ?? "Presente";
											await updateExperience(exp.id, { period: `${newYear} - ${end}` });
										}}
									/>
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
												value={lang === "es" ? exp.title_es : exp.title_en}
												onSave={async (v) => updateExperience(exp.id, { [lang === "es" ? "title_es" : "title_en"]: v })}
												table="experiences"
												id={exp.id}
												field={lang === "es" ? "title_es" : "title_en"}
											/>
										</h3>
										<h4 className="experience-company">
											<span className="company-icon">{">"}</span>
											<EditableText
												value={exp.company}
												onSave={async (v) => updateExperience(exp.id, { company: v })}
												table="experiences"
												id={exp.id}
												field="company"
											/>
										</h4>
									</div>

									{/* Meta badges — all three are editable */}
									<div className="experience-meta" onClick={(e) => e.stopPropagation()}>
										<EditableBadge
											className="location"
											value={lang === "es" ? (exp.location_es ?? "") : (exp.location_en ?? "")}
											onSave={(v) => updateExperience(exp.id, { [lang === "es" ? "location_es" : "location_en"]: v })}
										/>
										<EditableBadge
											className="type"
											value={lang === "es" ? (exp.type_es ?? "") : (exp.type_en ?? "")}
											onSave={(v) => updateExperience(exp.id, { [lang === "es" ? "type_es" : "type_en"]: v })}
										/>
										{/* Period end + duration in one badge */}
										<EditableBadge
											className="duration"
											value={lang === "es" ? (exp.duration_es ?? "") : (exp.duration_en ?? "")}
											onSave={(v) => updateExperience(exp.id, { [lang === "es" ? "duration_es" : "duration_en"]: v })}
										/>
										{/* Period end is also editable */}
										<EditableBadge
											className="period"
											value={exp.period.split(" - ")[1] ?? "Presente"}
											onSave={async (newEnd) => {
												const start = exp.period.split(" - ")[0];
												await updateExperience(exp.id, { period: `${start} - ${newEnd}` });
											}}
										/>
									</div>
								</div>

								<EditableTextarea
									value={lang === "es" ? exp.description_es : exp.description_en}
									onSave={(v) => updateExperience(exp.id, { [lang === "es" ? "description_es" : "description_en"]: v })}
									table="experiences"
									id={exp.id}
									field={lang === "es" ? "description_es" : "description_en"}
									className="experience-description"
								/>

								{/* Achievements — always visible in edit mode */}
								<div className={`experience-details ${isExpanded ? "visible" : ""}`}>
									<div className="achievements-section">
										<h5 className="section-title">
											<span className="title-icon">*</span>
											{lang === "es" ? "Logros Destacados" : "Key Achievements"}
										</h5>
										<EditableArray
											values={lang === "es" ? exp.achievements_es : exp.achievements_en}
											onSave={(v) => updateExperience(exp.id, { [lang === "es" ? "achievements_es" : "achievements_en"]: v })}
											table="experiences"
											id={exp.id}
											field={lang === "es" ? "achievements_es" : "achievements_en"}
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

								{/* Editable tech tags */}
								<EditableTechTags
									technologies={exp.technologies}
									onSave={(v) => updateExperience(exp.id, { technologies: v })}
								/>

								{/* Hide expand indicator in edit mode */}
								{!isEditMode && (
									<div className="expand-indicator">
										<span>
											{expandedIndex === exp.id
												? lang === "es" ? "[-] Colapsar" : "[-] Collapse"
												: lang === "es" ? "[+] Ver logros" : "[+] View achievements"}
										</span>
									</div>
								)}
							</div>
						</div>
					);
				})}

				{isEditMode && (
					<button className="experience-add-card" onClick={handleAddExperience}>
						<Plus size={32} />
						<span>{lang === "es" ? "Agregar Experiencia" : "Add Experience"}</span>
					</button>
				)}
			</div>
		</div>
	);
};
