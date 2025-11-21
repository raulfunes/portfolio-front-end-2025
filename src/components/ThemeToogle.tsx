import { Moon, Sun } from "lucide-react";

interface ThemeToogleProps {
	isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToogleProps> = ({isDark, toggle}) => {

  return (
    <button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer"}}>
      {isDark ? <Sun color="white" /> : <Moon />}
    </button>
  );
};