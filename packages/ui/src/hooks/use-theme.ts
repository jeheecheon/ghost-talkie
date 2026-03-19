import { useCallback, useEffect } from "react";
import { useStorageState } from "synced-storage/react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export default function useTheme() {
  const [theme, setTheme] = useStorageState<Theme>(STORAGE_KEY, "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;

    const themeColor = theme === "dark" ? "#030712" : "#f9fafb";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeColor);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { theme, toggleTheme };
}
