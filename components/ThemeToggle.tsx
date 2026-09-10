"use client";

import { useSyncExternalStore } from "react";

// Three-state theme control: Auto (follow the system) -> Light -> Dark.
// Applied as a .light/.dark class on <html> (no class = system); the
// choice persists in localStorage and is re-applied before first paint by
// the inline script in app/layout.tsx, so there is no flash. The theme is
// read through useSyncExternalStore: the server snapshot is "system", and
// the storage listener keeps multiple tabs in step.
type Theme = "system" | "light" | "dark";

const ORDER: Theme[] = ["system", "light", "dark"];
const LABELS: Record<Theme, string> = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
};

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  // A storage event means another tab changed the theme: re-apply the DOM
  // side effects here too (class + theme-color), not just the label.
  const onStorage = (e: StorageEvent) => {
    if (e.key === "theme" || e.key === null) applyTheme(getTheme());
    onChange();
  };
  listeners.add(onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return "system";
}

// The DOM side of a theme change: the .light/.dark class on <html> and the
// browser-chrome / PWA bar color ("system" restores the per-media pair from
// the viewport config). Idempotent, so cross-tab re-application is safe.
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme !== "system") root.classList.add(theme);
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      const forDark =
        theme === "system"
          ? meta.getAttribute("media")?.includes("dark")
          : theme === "dark";
      meta.content = forDark ? "#161618" : "#ffffff";
    });
}

function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {
    // Storage unavailable (private mode): the choice still applies for
    // this page view.
  }
  listeners.forEach((notify) => notify());
}

const ICONS: Record<Theme, React.ReactNode> = {
  // monitor: follow the system
  system: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </>
  ),
  // sun
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  // moon
  dark: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
};

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, (): Theme => "system");
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABELS[theme]}. Switch to ${LABELS[next]}`}
      title={`Theme: ${LABELS[theme]} (switch to ${LABELS[next]})`}
      className="flex items-center gap-1.5 rounded-md px-2 py-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-500"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-4 w-4"
      >
        {ICONS[theme]}
      </svg>
      {LABELS[theme]}
    </button>
  );
}
