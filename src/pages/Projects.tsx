import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableText, EditableTextarea } from "../components/editable";
import { Plus, Trash2, Loader2, Check, X, Pencil, Camera } from "lucide-react";
import { track } from "@vercel/analytics";
import "./Projects.css";

const STATUS_OPTIONS = ['live', 'development', 'archived'] as const;
type Status = typeof STATUS_OPTIONS[number];

const STATUS_LABELS: Record<Status, string> = {
	live: '[ LIVE ]',
	development: '[ DEV ]',
	archived: '[ ARCH ]',
};

// Inline editable tech tag list
const EditableTechList = ({
	tech,
	onSave,
}: {
	tech: string[];
	onSave: (updated: string[]) => Promise<void>;
}) => {
	const [editingIdx, setEditingIdx] = useState<number | null>(null);
	const [editingVal, setEditingVal] = useState('');
	const [addingNew, setAddingNew] = useState(false);
	const [newVal, setNewVal] = useState('');

	const handleEdit = (i: number) => {
		setEditingIdx(i);
		setEditingVal(tech[i]);
	};

	const handleSave = async (i: number) => {
		const updated = [...tech];
		updated[i] = editingVal.trim() || tech[i];
		await onSave(updated);
		setEditingIdx(null);
	};

	const handleDelete = async (i: number) => {
		await onSave(tech.filter((_, idx) => idx !== i));
	};

	const handleAdd = async () => {
		if (!newVal.trim()) { setAddingNew(false); return; }
		await onSave([...tech, newVal.trim()]);
		setNewVal('');
		setAddingNew(false);
	};

	return (
		<div className="project-tech edit-mode-tech">
			{tech.map((t, i) => (
				editingIdx === i ? (
					<span key={i} className="tech-badge tech-badge-editing">
						<input
							className="tech-badge-input"
							value={editingVal}
							onChange={e => setEditingVal(e.target.value)}
							onKeyDown={e => { if (e.key === 'Enter') handleSave(i); if (e.key === 'Escape') setEditingIdx(null); }}
							autoFocus
						/>
						<button className="tech-badge-action save" onClick={() => handleSave(i)}><Check size={12} /></button>
						<button className="tech-badge-action cancel" onClick={() => setEditingIdx(null)}><X size={12} /></button>
					</span>
				) : (
					<span key={i} className="tech-badge tech-badge-editable" onClick={() => handleEdit(i)}>
						{t}
						<button className="tech-tag-delete" onClick={e => { e.stopPropagation(); handleDelete(i); }}>
							<X size={10} />
						</button>
					</span>
				)
			))}
			{addingNew ? (
				<span className="tech-badge tech-badge-editing">
					<input
						className="tech-badge-input"
						placeholder="React..."
						value={newVal}
						onChange={e => setNewVal(e.target.value)}
						onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAddingNew(false); }}
						autoFocus
					/>
					<button className="tech-badge-action save" onClick={handleAdd}><Check size={12} /></button>
					<button className="tech-badge-action cancel" onClick={() => setAddingNew(false)}><X size={12} /></button>
				</span>
			) : (
				<button className="tech-badge tech-badge-add" onClick={() => setAddingNew(true)}>
					<Plus size={12} />
				</button>
			)}
		</div>
	);
};

// Inline editable link
const EditableLink = ({
	value,
	onSave,
	label,
	className,
}: {
	value: string | null;
	onSave: (v: string | null) => Promise<void>;
	label: string;
	className: string;
}) => {
	const [editing, setEditing] = useState(false);
	const [val, setVal] = useState(value || '');

	const handleSave = async () => {
		await onSave(val.trim() || null);
		setEditing(false);
	};

	if (editing) {
		return (
			<span className={`project-link-edit ${className}`}>
				<input
					className="project-link-input"
					placeholder="https://..."
					value={val}
					onChange={e => setVal(e.target.value)}
					onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
					autoFocus
				/>
				<button className="project-link-action save" onClick={handleSave}><Check size={13} /></button>
				<button className="project-link-action cancel" onClick={() => setEditing(false)}><X size={13} /></button>
			</span>
		);
	}

	return (
		<button className={`project-link ${className} editable-link`} onClick={() => setEditing(true)}>
			<Pencil size={11} />
			{value ? label : <span className="link-empty">{label} (vacío)</span>}
		</button>
	);
};

// Inline status selector
const EditableStatus = ({
	status,
	onSave,
}: {
	status: Status;
	onSave: (s: Status) => Promise<void>;
}) => {
	const [open, setOpen] = useState(false);

	const handleSelect = async (s: Status) => {
		await onSave(s);
		setOpen(false);
	};

	return (
		<div className="status-edit-wrapper">
			<button
				className={`project-status ${status} editable-status`}
				onClick={() => setOpen(o => !o)}
				title="Cambiar estado"
			>
				{STATUS_LABELS[status]} <Pencil size={9} style={{ marginLeft: 4 }} />
			</button>
			{open && (
				<div className="status-dropdown">
					{STATUS_OPTIONS.map(s => (
						<button
							key={s}
							className={`status-option ${s} ${s === status ? 'active' : ''}`}
							onClick={() => handleSelect(s)}
						>
							{STATUS_LABELS[s]}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

// Clickable image with upload overlay in edit mode
const ProjectImageUpload = ({
	src,
	alt,
	onUploaded,
}: {
	src: string;
	alt: string;
	onUploaded: (url: string) => Promise<void>;
}) => {
	const { isDemoMode } = useEditMode();
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Demo mode: just show a local preview without uploading
		if (isDemoMode) {
			const localUrl = URL.createObjectURL(file);
			await onUploaded(localUrl);
			return;
		}

		const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowed.includes(file.type)) {
			setError('Solo JPG, PNG, WEBP o GIF');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			setError('Max 5 MB');
			return;
		}

		setUploading(true);
		setError(null);
		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
			if (!res.ok) throw new Error('Upload failed');
			const { url } = await res.json();
			await onUploaded(url);
		} catch {
			setError('Error al subir');
		} finally {
			setUploading(false);
			// reset so same file can be re-selected
			if (inputRef.current) inputRef.current.value = '';
		}
	};

	return (
		<div className="project-image-upload" onClick={() => !uploading && inputRef.current?.click()}>
			<img src={src || ''} alt={alt} crossOrigin="anonymous" />
			<div className="image-upload-overlay">
				{uploading ? (
					<Loader2 size={28} className="spin upload-spinner" />
				) : (
					<>
						<Camera size={28} />
						<span>Cambiar imagen</span>
					</>
				)}
			</div>
			{error && <div className="image-upload-error">{error}</div>}
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				className="image-upload-input"
				onChange={handleFileChange}
			/>
		</div>
	);
};

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
		cardRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
		return () => observer.disconnect();
	}, [projects]);

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
							{isEditMode ? (
								<ProjectImageUpload
									src={project.image || ''}
									alt={lang === 'es' ? project.title_es : project.title_en}
									onUploaded={async (url) => updateProject(project.id, { image: url })}
								/>
							) : (
								<img
									src={project.image || ''}
									alt={lang === 'es' ? project.title_es : project.title_en}
									crossOrigin="anonymous"
								/>
							)}
							<div className="project-overlay">
								{isEditMode ? (
									<EditableStatus
										status={project.status as Status}
										onSave={async (s) => updateProject(project.id, { status: s })}
									/>
								) : (
									<span className={`project-status ${project.status}`}>
										{STATUS_LABELS[project.status as Status] ?? project.status}
									</span>
								)}
								<span className="project-year">
									{isEditMode ? (
										<EditableText
											value={project.year || ''}
											onSave={async (v) => updateProject(project.id, { year: v })}
											table="projects"
											id={project.id}
											field="year"
											className="project-year-input"
										/>
									) : project.year}
								</span>
							</div>
						</div>

						<div className="project-content">
							<h3 className="project-name">
								<span className="prompt-symbol">&gt;</span>
								<EditableText
									value={lang === 'es' ? project.title_es : project.title_en}
									onSave={async (v) => updateProject(project.id, { [lang === 'es' ? 'title_es' : 'title_en']: v })}
									table="projects"
									id={project.id}
									field={lang === 'es' ? 'title_es' : 'title_en'}
								/>
							</h3>

							<EditableTextarea
								value={lang === 'es' ? project.description_es : project.description_en}
								onSave={async (v) => updateProject(project.id, { [lang === 'es' ? 'description_es' : 'description_en']: v })}
								table="projects"
								id={project.id}
								field={lang === 'es' ? 'description_es' : 'description_en'}
								className="project-description"
							/>

							{isEditMode ? (
								<EditableTechList
									tech={project.tech}
									onSave={async (updated) => updateProject(project.id, { tech: updated })}
								/>
							) : (
								<div className="project-tech">
									{project.tech.map((t, i) => (
										<span key={i} className="tech-badge">{t}</span>
									))}
								</div>
							)}

							<div className="project-links">
								{isEditMode ? (
									<>
										<EditableLink
											value={project.link}
											onSave={async (v) => updateProject(project.id, { link: v })}
											label="Demo"
											className="demo"
										/>
										<EditableLink
											value={project.github}
											onSave={async (v) => updateProject(project.id, { github: v })}
											label={lang === 'es' ? 'Codigo' : 'Code'}
											className="github"
										/>
									</>
								) : (
									<>
										{project.link && (
											<a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link demo"
												onClick={() => track('project_link_click', { project: lang === 'es' ? project.title_es : project.title_en, type: 'demo' })}>
												<span className="link-icon">[~]</span> Demo
											</a>
										)}
										{project.github && (
											<a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link github"
												onClick={() => track('project_link_click', { project: lang === 'es' ? project.title_es : project.title_en, type: 'github' })}>
												<span className="link-icon">[&lt;&gt;]</span> {lang === 'es' ? 'Codigo' : 'Code'}
											</a>
										)}
									</>
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
