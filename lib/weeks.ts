// Week themes for display. The tasks themselves live in the database;
// this is just the label for each week card.
export const WEEK_THEMES: Record<number, string> = {
  1: "Foundations: hashing, two pointers, UMPIRE, JS/TS, React",
  2: "React/Next + core patterns + LLM fundamentals",
  3: "Data structures + full stack: lists, intervals, trees, Postgres",
  4: "Heaps and graphs + production SWE: testing, CI/CD, Docker",
  5: "Graph depth + retrieval: topo sort, union find, RAG",
  6: "Advanced patterns + agents/MCP: trie, greedy, DP",
  7: "DP completion + evals + timed practice",
  8: "Interview readiness + production polish",
};

export const TOTAL_WEEKS = 8;

// The plan's day 1 = Monday of the week containing this date.
// Used only to highlight "today" on the dashboard; edit to match your
// actual start date.
export const PLAN_START = new Date("2026-09-07T00:00:00");

export function currentPosition(now = new Date()): {
  week: number;
  day: number;
  started: boolean;
} {
  const msPerDay = 86_400_000;
  const diff = Math.floor((now.getTime() - PLAN_START.getTime()) / msPerDay);
  if (diff < 0) return { week: 1, day: 1, started: false };
  const week = Math.min(TOTAL_WEEKS, Math.floor(diff / 7) + 1);
  const day = Math.min(7, (diff % 7) + 1);
  return { week, day, started: true };
}
