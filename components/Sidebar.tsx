"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-actions";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/interview", label: "Interview Prep" },
  { href: "/system-design", label: "System Design" },
  { href: "/project", label: "Project" },
  { href: "/notes", label: "Notes" },
  { href: "/resources", label: "Resources" },
];

export function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/login")) return null;
  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible p-3 md:p-4 md:w-52 md:shrink-0 border-b md:border-b-0 md:border-r border-zinc-200 md:min-h-screen bg-white">
      <div className="hidden md:block px-3 pb-4">
        <Link href="/" className="font-bold text-lg tracking-tight">
          SWE&nbsp;Grind
        </Link>
        <p className="text-xs text-zinc-500">8-week plan</p>
      </div>
      {NAV.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="md:mt-auto md:pt-4">
        <form action={signOut} className="flex items-center gap-2 md:px-3">
          {email && (
            <span
              className="hidden max-w-28 truncate text-[11px] text-zinc-400 md:inline"
              title={email}
            >
              {email}
            </span>
          )}
          <button
            type="submit"
            className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 md:px-0"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );
}
