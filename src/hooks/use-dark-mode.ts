// src/hooks/use-dark-mode.ts
// Persists dark/light preference to localStorage.
// Applies data-theme="dark" to <html> element.
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function getSystemPreference(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStored(): Theme {
  try {
    const v = localStorage.getItem("agrilink-theme");
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemPreference() : theme;
  const html = document.documentElement;
  html.setAttribute("data-theme", resolved);
  // Also set class for Tailwind dark: variant
  html.classList.toggle("dark", resolved === "dark");
}

export function useDarkMode() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") return getStored();
    return "system";
  });

  const isDark =
    theme === "dark" || (theme === "system" && getSystemPreference() === "dark");

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem("agrilink-theme", theme);
    } catch {}
  }, [theme]);

  // Listen to system changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  function setTheme(t: Theme) {
    setThemeState(t);
  }

  function toggle() {
    setTheme(isDark ? "light" : "dark");
  }

  return { theme, isDark, setTheme, toggle };
}