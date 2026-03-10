import React from "react";
import { useTranslation } from "react-i18next";
import { useContactLinks } from "../hooks/usePortfolioData";
import { useEditMode } from "../contexts/EditModeContext";
import { EditableText } from "./editable";
import { FileTextIcon, Github, Linkedin, Mail, Link as LinkIcon, Plus, Trash2, Loader2 } from "lucide-react";
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

	const getIcon = (iconName: string | null) => {
		const IconComponent = iconName ? iconMap[iconName] : LinkIcon;
		return IconComponent || LinkIcon;
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
				
				return (
					<div key={link.id} className="icon-wrapper">
						<a href={link.url} className="icon" target="_blank" rel="noopener noreferrer">
							<IconComponent size={20} />
							{showName && (
								<EditableText
									value={label || ''}
									onSave={async (newValue) => {
										await updateLink(link.id, {
											[lang === 'es' ? 'label_es' : 'label_en']: newValue
										});
									}}
									table="contact_links"
									id={link.id}
									field={lang === 'es' ? 'label_es' : 'label_en'}
									as="p"
								/>
							)}
						</a>
						{isEditMode && (
							<button 
								className="icon-delete-btn"
								onClick={(e) => handleDeleteLink(link.id, e)}
								title="Eliminar"
							>
								<Trash2 size={12} />
							</button>
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
