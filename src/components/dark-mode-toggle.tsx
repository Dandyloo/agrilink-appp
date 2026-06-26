// src/components/dark-mode-toggle.tsx
// Drop this inside TopBar next to the bell icon.
// Uses useDarkMode hook to persist and apply the theme.
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/hooks/use-dark-mode";

export function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors dark:border-[#1E293B] dark:bg-[#111827] dark:text-[#94A3B8] dark:hover:bg-[#1E293B] dark:hover:text-white"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}