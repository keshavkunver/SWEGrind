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

export function fmtDate(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}
