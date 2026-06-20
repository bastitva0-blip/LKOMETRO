import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "lkometro:themePreference";

const readPreference = (): ThemePreference => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
    return "system";
  } catch {
    return "system";
  }
};

const writePreference = (pref: ThemePreference): void => {
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    // ignore
  }
};

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyThemeClass = (theme: ResolvedTheme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readPreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    preference === "system" ? getSystemTheme() : (preference as ResolvedTheme)
  );

  // Apply the resolved theme to <html> whenever it changes
  useEffect(() => {
    applyThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  // Recompute resolved theme whenever preference changes
  useEffect(() => {
    const next = preference === "system" ? getSystemTheme() : preference;
    setResolvedTheme(next);
  }, [preference]);

  // Listen for OS-level theme changes while preference is "system"
  useEffect(() => {
    if (preference !== "system" || typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedTheme(mql.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    writePreference(pref);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
