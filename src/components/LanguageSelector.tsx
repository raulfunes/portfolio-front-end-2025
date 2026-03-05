import { useTranslation } from "react-i18next";
import "./RetroToggle.css";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const handleToggle = () => {
    i18n.changeLanguage(isEn ? "es" : "en");
  };

  return (
    <button
      className={`retro-toggle ${isEn ? "active" : ""}`}
      onClick={handleToggle}
      aria-label={`Switch language to ${isEn ? "Español" : "English"}`}
    >
      <span className="retro-toggle-text-label">ES</span>
      <span className="retro-toggle-track">
        <span className="retro-toggle-thumb" />
      </span>
      <span className="retro-toggle-text-label">EN</span>
    </button>
  );
};
