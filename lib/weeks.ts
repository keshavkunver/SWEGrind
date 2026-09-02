// Week themes for display. The tasks themselves live in the database;
// this is just the label for each week card.
export const WEEK_THEMES: Record<number, string> = {
  1: "Foundations: hashing, two pointers, JS/TS, React, Claude Code",
  2: "Core patterns + Next.js and LLM API fundamentals",
  3: "Data: linked lists, trees, PostgreSQL, auth, full-stack foundation",
  4: "Shipping: testing, CI/CD, Docker, tool calling, V1 deploy",
  5: "Graphs, RAG, retrieval, async jobs, scaling concepts",
  6: "Backtracking, DP, MCP, agents, reliability",
  7: "Practice: timed interviews, evals, observability, polish",
  8: "Mocks, deployment, portfolio, heavy applications",
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
