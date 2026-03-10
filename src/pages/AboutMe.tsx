import React, { useState, useCallback } from "react";
import "./AboutMe.css";
import IconsComponent from "../components/IconsComponent";
import { useTranslation } from "react-i18next";
import TypewriterText from "../components/TypewriterText";
import TerminalFrame from "../components/TerminalFrame";
import TechBadges from "../components/TechBadges";
import RotatingRole from "../components/RotatingRole";
import { useHeroRoles, usePersonalInfo } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableTextarea } from "../components/editable";
import { Plus, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";

interface AboutMeProps {
	aboutWidth: number;
	aboutWidthStr: string;
	thresholdReached: boolean;
}

const AboutMe: React.FC<AboutMeProps> = ({ aboutWidth, aboutWidthStr, thresholdReached }) => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language as 'es' | 'en';
	const [titleDone, setTitleDone] = useState(false);
	const [roleDone, setRoleDone] = useState(false);
	
	const { roles, isLoading: rolesLoading, updateRole, createRole, deleteRole } = useHeroRoles();
	const { getInfo, updateInfo } = usePersonalInfo();
	const { isEditMode, editLanguage } = useEditMode();
	
	const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
	const [editRoleValue, setEditRoleValue] = useState("");
	const [showRolesEditor, setShowRolesEditor] = useState(false);

	const handleTitleComplete = useCallback(() => setTitleDone(true), []);
	const handleFirstRoleComplete = useCallback(() => setRoleDone(true), []);

	// Get roles array for the rotating animation
	const rolesList = roles.map(r => lang === 'es' ? r.role_es : r.role_en);
	const fallbackRoles = t("about-me.roles", { returnObjects: true }) as string[];
	const displayRoles = rolesList.length > 0 ? rolesList : fallbackRoles;

	// Get description from database or fallback to i18n
	const description = getInfo('about_description', lang) || t("about-me.paragraph");

	const isCompact = !thresholdReached;

	const handleStartEditRole = (id: string, value: string) => {
		setEditingRoleId(id);
		setEditRoleValue(value);
	};

	const handleSaveRole = async (id: string) => {
		if (editRoleValue.trim()) {
			await updateRole(id, {
				[editLanguage === 'es' ? 'role_es' : 'role_en']: editRoleValue.trim()
			});
		}
		setEditingRoleId(null);
	};

	const handleAddRole = async () => {
		await createRole({
			role_es: 'Nuevo Rol',
			role_en: 'New Role',
			sort_order: roles.length + 1
		});
	};

	const handleDeleteRole = async (id: string) => {
		if (confirm('¿Eliminar este rol?')) {
			await deleteRole(id);
		}
	};

	const handleSaveDescription = async (newValue: string) => {
		const currentEs = getInfo('about_description', 'es');
		const currentEn = getInfo('about_description', 'en');
		
		if (editLanguage === 'es') {
			await updateInfo('about_description', newValue, currentEn || newValue);
		} else {
			await updateInfo('about_description', currentEs || newValue, newValue);
		}
	};

	return (
		<div style={{ width: aboutWidthStr }} className={thresholdReached ? "about-me-container" : "about-me-container threshold"}>
			<div className={thresholdReached ? "about-content" : "about-content threshold"}>
				<div style={{ width: aboutWidth * 2.5 }} className="photo-wrapper">
					<div className="photo-glow" />
					<div className="about-photo">
						<img src="./src/assets/myself.JPG" alt="Raul Funes" />
					</div>
				</div>

				<TerminalFrame className={isCompact ? "terminal-area terminal-compact" : "terminal-area"}>
					<TypewriterText
						text={t("about-me.title")}
						as="h1"
						speed={50}
						delay={300}
						onComplete={handleTitleComplete}
					/>
					
					{/* Rotating Role with edit button */}
					<div className="role-container">
						<RotatingRole
							roles={displayRoles}
							as="h2"
							speed={45}
							pauseDuration={2200}
							initialDelay={titleDone ? 200 : 99999}
							onFirstComplete={handleFirstRoleComplete}
						/>
						{isEditMode && (
							<button 
								className="edit-roles-btn"
								onClick={() => setShowRolesEditor(!showRolesEditor)}
								title="Editar roles"
							>
								<Pencil size={14} />
							</button>
						)}
					</div>

					{/* Roles Editor Panel */}
					{isEditMode && showRolesEditor && (
						<div className="roles-editor">
							<div className="roles-editor-header">
								<span>Editar Roles ({editLanguage.toUpperCase()})</span>
								<button onClick={() => setShowRolesEditor(false)}>
									<X size={14} />
								</button>
							</div>
							{rolesLoading ? (
								<Loader2 className="spin" size={16} />
							) : (
								<div className="roles-list">
									{roles.map((role) => {
										const roleValue = editLanguage === 'es' ? role.role_es : role.role_en;
										return (
											<div key={role.id} className="role-item">
												{editingRoleId === role.id ? (
													<>
														<input
															type="text"
															value={editRoleValue}
															onChange={(e) => setEditRoleValue(e.target.value)}
															className="role-edit-input"
															autoFocus
														/>
														<button onClick={() => handleSaveRole(role.id)} className="role-save-btn">
															<Check size={12} />
														</button>
														<button onClick={() => setEditingRoleId(null)} className="role-cancel-btn">
															<X size={12} />
														</button>
													</>
												) : (
													<>
														<span>{roleValue}</span>
														<button onClick={() => handleStartEditRole(role.id, roleValue)} className="role-edit-btn">
															<Pencil size={12} />
														</button>
														<button onClick={() => handleDeleteRole(role.id)} className="role-delete-btn">
															<Trash2 size={12} />
														</button>
													</>
												)}
											</div>
										);
									})}
									<button onClick={handleAddRole} className="role-add-btn">
										<Plus size={14} /> Agregar Rol
									</button>
								</div>
							)}
						</div>
					)}

					{/* Description - Editable */}
					{isEditMode ? (
						<EditableTextarea
							value={getInfo('about_description', editLanguage) || description}
							onSave={handleSaveDescription}
							table="personal_info"
							id="about_description"
							field={`value_${editLanguage}`}
							className={roleDone ? "hero-fade-in visible hero-description" : "hero-fade-in hero-description"}
						/>
					) : (
						<p className={roleDone ? "hero-fade-in visible" : "hero-fade-in"}>{description}</p>
					)}

					<TechBadges
						className={roleDone ? "hero-fade-in visible" : "hero-fade-in"}
						compact={isCompact}
					/>
					<div className={roleDone ? "terminal-contact-line hero-fade-in visible delay-1" : "terminal-contact-line hero-fade-in"}>
						<span className="terminal-prompt">$</span>
						<span className="terminal-cmd">contact</span>
						<span className="terminal-flag">--via</span>
						<IconsComponent
							className="icons-container-terminal"
							showName={thresholdReached}
						/>
					</div>
				</TerminalFrame>
			</div>
		</div>
	);
};

export default AboutMe;
