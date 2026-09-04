export const STATUSES = ["not_started", "in_progress", "complete"] as const;

export const STATUS_LABELS: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  complete: "Complete",
};

export const CATEGORY_LABELS: Record<string, string> = {
  InterviewPrep: "Interview Prep",
  Engineering: "Engineering",
  SystemDesign: "System Design",
  AIEngineering: "AI Engineering",
  Project: "Project",
  Career: "Career",
};

export const CATEGORY_COLORS: Record<string, string> = {
  InterviewPrep: "bg-amber-100 text-amber-800",
  Engineering: "bg-sky-100 text-sky-800",
  SystemDesign: "bg-violet-100 text-violet-800",
  AIEngineering: "bg-emerald-100 text-emerald-800",
  Project: "bg-rose-100 text-rose-800",
  Career: "bg-slate-200 text-slate-700",
};

export const CONFIDENCE_LEVELS = [
  "unknown",
  "recognize",
  "explain",
  "guided",
  "independent",
  "interview_ready",
] as const;

// Mastery ladder (0-5). Tracked separately from problem completion:
// checking off a pattern's four problems does not make it mastered.
export const CONFIDENCE_LABELS: Record<string, string> = {
  unknown: "0 · Unknown",
  recognize: "1 · Understand the concept",
  explain: "2 · Recognize obvious examples",
  guided: "3 · Solve guided applications",
  independent: "4 · Apply independently",
  interview_ready: "5 · Interview ready",
};

// The four curriculum problem roles per pattern (A/B/C/D): scaffolding is
// progressively removed from guided walkthrough to unlabeled transfer test.
export const PROBLEM_KINDS = [
  "guided",
  "supported",
  "independent",
  "transfer",
] as const;

export const RESOURCE_TYPES = [
  "docs",
  "course",
  "video",
  "article",
  "practice",
  "tool",
] as const;
