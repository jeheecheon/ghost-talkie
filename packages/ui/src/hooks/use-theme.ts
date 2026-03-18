import { useCallback, useEffect } from "react";
import { useStorageState } from "synced-storage/react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function useTheme() {
  const [theme, setTheme] = useStorageState<Theme>(
    STORAGE_KEY,
    getSystemTheme(),
  );

  useEffect(() => {
    function applyTheme(theme: Theme) {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }

    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { theme, toggleTheme };
}
