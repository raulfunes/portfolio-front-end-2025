import { FileText, Github, Linkedin, Mail } from "lucide-react";

interface IconsComponentProps {
  style?: React.CSSProperties;
  className?: string;
  showName?: boolean;
}

export function IconsComponent({ style, className, showName }: IconsComponentProps) {
  return (
    <div style={style} className={className}>
      <a href="mailto:raulsergiofunes@gmail.com" className="icon">
        <Mail size={20} />
        {showName && <p>Email</p>}
      </a>
      <a
        href="https://linkedin.com/in/raulfunes"
        target="_blank"
        rel="noopener noreferrer"
        className="icon"
      >
        <Linkedin size={20} />
        {showName && <p>Linkedin</p>}
      </a>
      <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="icon">
        <FileText size={20} />
        {showName && <p>Curriculum</p>}
      </a>
      <a
        href="https://github.com/raulfunes"
        target="_blank"
        rel="noopener noreferrer"
        className="icon"
      >
        <Github size={20} />
        {showName && <p>Github</p>}
      </a>
    </div>
  );
}
