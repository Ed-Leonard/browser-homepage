"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Theme =
  | "dark"
  | "light"
  | "gruvbox"
  | "silk"
  | "jungle"
  | "parchment";
export type Font = "mono" | "sans" | "serif";

const ThemeContext = createContext<{
  theme: Theme;
  font: Font;
  setTheme: (t: Theme) => void;
  setFont: (f: Font) => void;
}>({ theme: "gruvbox", font: "sans", setTheme: () => {}, setFont: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () =>
      (typeof window !== "undefined"
        ? (localStorage.getItem("theme") as Theme)
        : null) ?? "gruvbox",
  );
  const [font, setFontState] = useState<Font>(
    () =>
      (typeof window !== "undefined"
        ? (localStorage.getItem("font") as Font)
        : null) ?? "mono",
  );

  const setTheme = (t: Theme) => {
    localStorage.setItem("theme", t);
    setThemeState(t);
  };

  const setFont = (f: Font) => {
    localStorage.setItem("font", f);
    setFontState(f);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-font", font);
  }, [theme, font]);

  return (
    <ThemeContext.Provider value={{ theme, font, setTheme, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
