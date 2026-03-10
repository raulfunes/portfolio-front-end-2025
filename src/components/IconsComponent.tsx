import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContactLinks } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { FileTextIcon, Github, Linkedin, Mail, Link as LinkIcon, Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import "./IconsComponent.css";

interface IconsComponentProps {
	style?: React.CSSProperties;
	className?: string;
	showName?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
	Mail: Mail,
	Linkedin: Linkedin,
	Github: Github,
	FileDown: FileTextIcon,
	Link: LinkIcon,
};

const IconsComponent: React.FC<IconsComponentProps> = ({ style, className, showName }) => {
	const { i18n } = useTranslation();
	const lang = i18n.language as 'es' | 'en';
	const { links, isLoading, updateLink, createLink, deleteLink } = useContactLinks();
	const { isEditMode } = useEditMode();
	
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editLabel, setEditLabel] = useState("");
	const [editUrl, setEditUrl] = useState("");

	const getIcon = (iconName: string | null) => {
		const IconComponent = iconName ? iconMap[iconName] : LinkIcon;
		return IconComponent || LinkIcon;
	};

	const handleStartEdit = (id: string, label: string, url: string) => {
		setEditingId(id);
		setEditLabel(label);
		setEditUrl(url);
	};

	const handleSaveEdit = async (id: string) => {
		await updateLink(id, {
			[lang === 'es' ? 'label_es' : 'label_en']: editLabel,
			url: editUrl
		});
		setEditingId(null);
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditLabel("");
		setEditUrl("");
	};

	const handleAddLink = async () => {
		await createLink({
			type: 'other',
			url: 'https://example.com',
			label_es: 'Nuevo Link',
			label_en: 'New Link',
			icon: 'Link',
			sort_order: links.length + 1
		});
	};

	const handleDeleteLink = async (id: string, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (confirm('¿Eliminar este link?')) {
			await deleteLink(id);
		}
	};

	const handleLinkClick = (e: React.MouseEvent) => {
		// Prevent link navigation in edit mode
		if (isEditMode) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	if (isLoading) {
		return (
			<div style={style} className={className}>
				<Loader2 className="spin" size={20} />
			</div>
		);
	}

	return (
		<div style={style} className={`${className} ${isEditMode ? 'edit-mode' : ''}`}>
			{links.map((link) => {
				const IconComponent = getIcon(link.icon);
				const label = lang === 'es' ? link.label_es : link.label_en;
				
				if (editingId === link.id) {
					return (
						<div key={link.id} className="icon-edit-form">
							<input
								type="text"
								value={editLabel}
								onChange={(e) => setEditLabel(e.target.value)}
								placeholder="Label"
								className="icon-edit-input"
							/>
							<input
								type="text"
								value={editUrl}
								onChange={(e) => setEditUrl(e.target.value)}
								placeholder="URL"
								className="icon-edit-input url"
							/>
							<button onClick={() => handleSaveEdit(link.id)} className="icon-edit-save">
								<Check size={14} />
							</button>
							<button onClick={handleCancelEdit} className="icon-edit-cancel">
								<X size={14} />
							</button>
						</div>
					);
				}
				
				return (
					<div key={link.id} className="icon-wrapper">
						<a 
							href={link.url} 
							className={`icon ${isEditMode ? 'no-click' : ''}`}
							target="_blank" 
							rel="noopener noreferrer"
							onClick={(e) => handleLinkClick(e)}
						>
							<IconComponent size={20} />
							{showName && <span className="icon-label">{label || ''}</span>}
						</a>
						{isEditMode && (
							<>
								<button 
									className="icon-edit-btn"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleStartEdit(link.id, label || '', link.url);
									}}
									title="Editar"
								>
									<Pencil size={12} />
								</button>
								<button 
									className="icon-delete-btn"
									onClick={(e) => handleDeleteLink(link.id, e)}
									title="Eliminar"
								>
									<Trash2 size={12} />
								</button>
							</>
						)}
					</div>
				);
			})}
			
			{isEditMode && (
				<button className="icon-add-btn" onClick={handleAddLink}>
					<Plus size={16} />
				</button>
			)}
		</div>
	);
};

export default IconsComponent;
