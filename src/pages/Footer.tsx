import React from "react";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-terminal">
          <div className="footer-command">
            <span className="footer-prompt">$</span>
            <span className="footer-text">echo "Gracias por visitar"</span>
          </div>
          <div className="footer-output">
            <span className="output-arrow">&gt;</span>
            <span>Gracias por visitar</span>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-links">
          <a 
            href="mailto:raul@example.com" 
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
            {" "}{currentYear} Raul Funes - Hecho con React{" "}
            <span className="copyright-symbol">{"*/"}</span>
          </p>
          <p className="footer-status">
            <span className="status-dot"></span>
            Disponible para proyectos
          </p>
        </div>
      </div>
    </footer>
  );
};
