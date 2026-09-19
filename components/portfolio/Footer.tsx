import type { Locale } from "@/lib/types";

interface FooterProps {
  locale?: Locale;
}

export function Footer({ locale = "es" }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const thanksText = locale === "en" ? "Thanks for visiting" : "Gracias por visitar";

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-terminal">
          <div className="footer-command">
            <span className="footer-prompt">$</span>
            <span className="footer-text">{`echo "${thanksText}"`}</span>
          </div>
          <div className="footer-output">
            <span className="output-arrow">&gt;</span>
            <span>{thanksText}</span>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-links">
          <a
            href="mailto:raulsergiofunes@gmail.com"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="link-icon">[~]</span>
            Email
          </a>
          <a
            href="https://linkedin.com/in/raulfunes"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="link-icon">[in]</span>
            LinkedIn
          </a>
          <a
            href="https://github.com/raulfunes"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="link-icon">[gh]</span>
            GitHub
          </a>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            <span className="copyright-symbol">{"/*"}</span>
            {" "}{currentYear} Raul Funes - {locale === "en" ? "Made with Next.js" : "Hecho con Next.js"}{" "}
            <span className="copyright-symbol">{"*/"}</span>
          </p>
          <p className="footer-status">
            <span className="status-dot"></span>
            {locale === "en" ? "Available for projects" : "Disponible para proyectos"}
          </p>
        </div>
      </div>
    </footer>
  );
}
