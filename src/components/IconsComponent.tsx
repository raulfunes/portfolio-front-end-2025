import React from "react";
import "./IconsComponent.css";
import { FileTextIcon, Github, Linkedin, Mail } from "lucide-react";

interface IconsComponentProps {
	style?: React.CSSProperties;
	className?: string;
	showName?: boolean;
}

const IconsComponent: React.FC<IconsComponentProps> = ({ style, className, showName }) => {
	return (
		<div style={style} className={`${className}`}>
			<a href="mailto:raulsergiofunes@gmail.com" className="icon">
				<Mail size={20}/>
				{showName && <p>Email</p>}
			</a>
			<a href="mailto:raulsergiofunes@gmail.com" className="icon">
				<Linkedin size={20}/>
				{showName && <p>Linkedin</p>}
			</a>
			<a href="mailto:raulsergiofunes@gmail.com" className="icon">
				<FileTextIcon size={20}/>
				{showName && <p>Curriculum</p>}
			</a>
			<a href="mailto:raulsergiofunes@gmail.com" className="icon">
				<Github size={20}/>
				{showName && <p>Github</p>}
			</a>
		</div>
	);
};

export default IconsComponent;
