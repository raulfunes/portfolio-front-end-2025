import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToogle";
import "./Navbar.css"

interface NavbarProps {
	isDark: boolean;
  toggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({isDark, toggle}) => {
  return (
    <div className="navbar">
        <ThemeToggle isDark={isDark} toggle={toggle}></ThemeToggle>
        <LanguageSelector></LanguageSelector>
    </div>

  );
};