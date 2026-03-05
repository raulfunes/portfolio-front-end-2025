import { Moon, Sun } from "lucide-react";
import "./RetroToggle.css";

interface ThemeToogleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToogleProps> = ({ isDark, toggle }) => {
  return (
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
  );
};
