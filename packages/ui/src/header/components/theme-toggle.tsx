import { Moon, Sun } from "lucide-react";
import { cn } from "@workspace/lib/cn";
import { Button } from "@workspace/ui/primitives/button";
import useTheme from "@workspace/ui/hooks/use-theme";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      className={cn(className)}
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
