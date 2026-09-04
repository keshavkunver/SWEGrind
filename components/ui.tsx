import Link from "next/link";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CONFIDENCE_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";
import { parseLinksJson } from "@/lib/links";

export function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={`h-2 w-full rounded-full bg-zinc-200 ${className}`}>
      <div
        className="h-2 rounded-full bg-zinc-900 transition-[width] motion-reduce:transition-none"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${
        CATEGORY_COLORS[category] ?? "bg-zinc-100 text-zinc-700"
      }`}
    >
      {CATEGORY_LABELS[category] ?? category}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  not_started: "bg-zinc-100 text-zinc-500 border-zinc-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// A form button that cycles status via a bound server action.
export function StatusCycler({
  status,
  action,
}: {
  status: string;
  action: () => Promise<void>;
}) {
  return (
    <form action={action} className="inline">
      <button
        type="submit"
        title="Click to cycle status"
        className={`rounded-full border px-2.5 py-2 text-xs font-medium cursor-pointer transition-colors hover:opacity-75 focus-visible:ring-2 focus-visible:ring-zinc-500 md:py-1 ${
          STATUS_STYLES[status] ?? STATUS_STYLES.not_started
        }`}
      >
        {status === "complete" ? "✓ " : ""}
        {STATUS_LABELS[status] ?? status}
      </button>
    </form>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        STATUS_STYLES[status] ?? STATUS_STYLES.not_started
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: string }) {
  const ready = confidence === "interview_ready";
  const known = confidence !== "unknown";
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
        ready
          ? "bg-emerald-100 text-emerald-800"
          : known
            ? "bg-sky-50 text-sky-700"
            : "bg-zinc-100 text-zinc-500"
      }`}
    >
      {CONFIDENCE_LABELS[confidence] ?? confidence}
    </span>
  );
}

export function LinkChips({ json }: { json: string }) {
  const links = parseLinksJson(json);
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {links.map((l, i) => (
        <a
          key={i}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-50"
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-zinc-200 bg-white p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-block text-sm text-zinc-500 hover:text-zinc-900"
    >
      ← {label}
    </Link>
  );
}
