// Progress = completed / total. In-progress items count half so the
// dashboard moves as soon as work starts.
export function pct(items: { status: string }[]): number {
  if (items.length === 0) return 0;
  const score = items.reduce(
    (acc, i) =>
      acc + (i.status === "complete" ? 1 : i.status === "in_progress" ? 0.5 : 0),
    0
  );
  return Math.round((score / items.length) * 100);
}

// A pattern's status is derived from its problems, not stored.
export function derivedStatus(items: { status: string }[]): string {
  if (items.length === 0) return "not_started";
  if (items.every((i) => i.status === "complete")) return "complete";
  if (items.some((i) => i.status !== "not_started")) return "in_progress";
  return "not_started";
}

export function countComplete(items: { status: string }[]): number {
  return items.filter((i) => i.status === "complete").length;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

// Dates are stored as server-local midnight (see daysFromNow in actions),
// so format with local getters; toISOString would shift the day for any
// server east of UTC.
export function fmtDate(d: Date | null): string {
  if (!d) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
