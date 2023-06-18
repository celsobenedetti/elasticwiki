import { useTheme } from "@/store/theme";
import { Button } from "./ui/button";
import { HeroIcon, SVGShapes } from "./HeroIcon";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="fixed top-0 flex h-header w-full items-center justify-between px-4">
      <span></span>
      <Button
        onClick={toggleTheme}
        variant="ghost"
        className="relative h-9 w-9"
      >
        <HeroIcon
          className="absolute h-6 w-6"
          shape={theme == "light" ? SVGShapes.sun : SVGShapes.moon}
        />
      </Button>
    </header>
  );
}
