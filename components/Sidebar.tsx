"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-actions";

// Nav renders three ways: a sidebar on desktop, and on mobile a sticky
// top bar (brand + sign out) plus a fixed bottom tab bar for thumb reach.
const NAV = [
  { href: "/", label: "Dashboard", short: "Home", icon: "home" },
  { href: "/roadmap", label: "Roadmap", short: "Map", icon: "map" },
  { href: "/interview", label: "Interview Prep", short: "Prep", icon: "code" },
  { href: "/system-design", label: "System Design", short: "Design", icon: "layers" },
  { href: "/project", label: "Project", short: "Project", icon: "box" },
  { href: "/notes", label: "Notes", short: "Notes", icon: "note" },
  { href: "/resources", label: "Resources", short: "Library", icon: "bookmark" },
] as const;

const ICON_PATHS: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
    </>
  ),
  layers: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
      <path d="M7 7h.01M7 17h.01" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </>
  ),
  note: (
    <>
      <path d="M6 2h9l5 5v15H6V2Z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </>
  ),
  bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
};

function NavIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile: sticky top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-4 py-2.5 backdrop-blur md:hidden">
        <Link href="/" className="font-bold tracking-tight">
          SWE&nbsp;Grind
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md px-3 py-2.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-500"
          >
            Sign out
          </button>
        </form>
      </header>

      {/* Desktop: sidebar */}
      <nav className="hidden md:flex md:min-h-screen md:w-52 md:shrink-0 md:flex-col md:gap-1 md:border-r md:border-zinc-200 md:bg-white md:p-4">
        <div className="px-3 pb-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            SWE&nbsp;Grind
          </Link>
          <p className="text-xs text-zinc-500">8-week plan</p>
        </div>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-zinc-500 lg:py-1.5 ${
              isActive(item.href)
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
        <div className="mt-auto pt-4">
          <form action={signOut} className="flex items-center gap-2 px-3">
            {email && (
              <span
                className="max-w-28 truncate text-[11px] text-zinc-400"
                title={email}
              >
                {email}
              </span>
            )}
            <button
              type="submit"
              className="whitespace-nowrap rounded-md py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile: fixed bottom tab bar */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-0.5 pb-1.5 pt-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-500 ${
                active ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              <NavIcon
                name={item.icon}
                className={`h-5 w-5 ${active ? "stroke-[2.2]" : ""}`}
              />
              <span
                className={`w-full truncate text-center text-[10px] leading-tight ${active ? "font-semibold" : "font-medium"}`}
              >
                {item.short}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
