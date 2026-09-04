import type { Problem } from "@prisma/client";
import { cycleProblemStatus, updateProblemWork } from "@/lib/actions";
import { CONFIDENCE_LABELS, CONFIDENCE_LEVELS } from "@/lib/constants";
import { fmtDate } from "@/lib/progress";
import { ConfidenceBadge, StatusCycler } from "@/components/ui";

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "text-emerald-600",
  medium: "text-amber-600",
  hard: "text-red-600",
};

// A problem from the curriculum. The problem itself is read-only; the
// learner cycles status (completion auto-schedules review) and records
// their own confidence, complexity analysis, and notes.
export function ProblemRow({ problem }: { problem: Problem }) {
  return (
    <div className="border-b border-zinc-100 py-2.5 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <StatusCycler
          status={problem.status}
          action={cycleProblemStatus.bind(null, problem.id)}
        />
        {problem.url ? (
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-700 hover:underline"
          >
            {problem.name} ↗
          </a>
        ) : (
          <span className="font-medium">{problem.name}</span>
        )}
        <span
          className={`text-xs font-medium capitalize ${DIFFICULTY_STYLES[problem.difficulty] ?? ""}`}
        >
          {problem.difficulty}
        </span>
        <ConfidenceBadge confidence={problem.confidence} />
        {problem.nextReviewAt && (
          <span className="text-xs text-violet-600">
            review {fmtDate(problem.nextReviewAt)}
          </span>
        )}
        {(problem.timeComplexity || problem.spaceComplexity) && (
          <span className="font-mono text-xs text-zinc-400">
            {problem.timeComplexity && `T: ${problem.timeComplexity}`}
            {problem.timeComplexity && problem.spaceComplexity && " · "}
            {problem.spaceComplexity && `S: ${problem.spaceComplexity}`}
          </span>
        )}
      </div>
      {problem.notes && (
        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600">
          {problem.notes}
        </p>
      )}
      <details className="mt-1">
        <summary className="cursor-pointer py-2 text-xs text-zinc-400 hover:text-zinc-700 md:py-0">
          My solution notes
        </summary>
        <form
          action={updateProblemWork.bind(null, problem.id)}
          className="mt-2 grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm"
        >
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Confidence
              </span>
              <select
                name="confidence"
                defaultValue={problem.confidence}
                className="rounded border border-zinc-300 bg-white px-2 py-1"
              >
                {CONFIDENCE_LEVELS.map((c) => (
                  <option key={c} value={c}>
                    {CONFIDENCE_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Time complexity
              </span>
              <input
                name="timeComplexity"
                defaultValue={problem.timeComplexity}
                placeholder="O(n)"
                className="rounded border border-zinc-300 px-2 py-1 font-mono"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Space complexity
              </span>
              <input
                name="spaceComplexity"
                defaultValue={problem.spaceComplexity}
                placeholder="O(1)"
                className="rounded border border-zinc-300 px-2 py-1 font-mono"
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">Notes</span>
            <textarea
              name="notes"
              defaultValue={problem.notes}
              rows={3}
              placeholder="Approach, key insight, what to remember next time…"
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save
            </button>
            {problem.firstAttempt && (
              <span className="text-xs text-zinc-400">
                first attempted {fmtDate(problem.firstAttempt)}
                {problem.lastReviewed &&
                  ` · last reviewed ${fmtDate(problem.lastReviewed)}`}
                {problem.attemptCount > 0 &&
                  ` · ${problem.attemptCount} attempt${problem.attemptCount === 1 ? "" : "s"}`}
              </span>
            )}
          </div>
        </form>
      </details>
    </div>
  );
}
