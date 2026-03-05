"use client";

import { Moon, Sun } from "lucide-react";

interface NavbarProps {
  isDark: boolean;
  toggle: () => void;
  locale: string;
  onLocaleChange: (locale: string) => void;
}

export function Navbar({ isDark, toggle, locale, onLocaleChange }: NavbarProps) {
  const isEn = locale === "en";

  return (
    <div className="navbar">
      <button
        className={`retro-toggle ${isDark ? "active" : ""}`}
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className="retro-toggle-label">
          <Sun size={14} />
        </span>
        <span className="retro-toggle-track">
          <span className="retro-toggle-thumb" />
        </span>
        <span className="retro-toggle-label">
          <Moon size={14} />
        </span>
      </button>

      <button
        className={`retro-toggle ${isEn ? "active" : ""}`}
        onClick={() => onLocaleChange(isEn ? "es" : "en")}
        aria-label={`Switch language to ${isEn ? "Español" : "English"}`}
      >
        <span className="retro-toggle-text-label">ES</span>
        <span className="retro-toggle-track">
          <span className="retro-toggle-thumb" />
        </span>
        <span className="retro-toggle-text-label">EN</span>
      </button>
    </div>
  );
}
