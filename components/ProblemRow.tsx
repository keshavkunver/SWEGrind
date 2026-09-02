import type { Problem } from "@prisma/client";
import {
  cycleProblemStatus,
  deleteProblem,
  updateProblem,
} from "@/lib/actions";
import {
  CONFIDENCE_LABELS,
  CONFIDENCE_LEVELS,
  DIFFICULTIES,
  PROBLEM_KINDS,
  STATUSES,
  STATUS_LABELS,
} from "@/lib/constants";
import { fmtDate } from "@/lib/progress";
import { ConfidenceBadge, StatusCycler } from "@/components/ui";

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "text-emerald-600",
  medium: "text-amber-600",
  hard: "text-red-600",
};

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
        <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700">
          Edit problem
        </summary>
        <form
          action={updateProblem.bind(null, problem.id)}
          className="mt-2 grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">Name</span>
              <input
                name="name"
                defaultValue={problem.name}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                LeetCode URL
              </span>
              <input
                name="url"
                defaultValue={problem.url}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">Type</span>
              <select
                name="kind"
                defaultValue={problem.kind}
                className="rounded border border-zinc-300 bg-white px-2 py-1 capitalize"
              >
                {PROBLEM_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Difficulty
              </span>
              <select
                name="difficulty"
                defaultValue={problem.difficulty}
                className="rounded border border-zinc-300 bg-white px-2 py-1 capitalize"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">Status</span>
              <select
                name="status"
                defaultValue={problem.status}
                className="rounded border border-zinc-300 bg-white px-2 py-1"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
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
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                First attempted
              </span>
              <input
                name="firstAttempt"
                type="date"
                defaultValue={fmtDate(problem.firstAttempt)}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Last reviewed
              </span>
              <input
                name="lastReviewed"
                type="date"
                defaultValue={fmtDate(problem.lastReviewed)}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Next review
              </span>
              <input
                name="nextReviewAt"
                type="date"
                defaultValue={fmtDate(problem.nextReviewAt)}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">Notes</span>
            <textarea
              name="notes"
              defaultValue={problem.notes}
              rows={3}
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save
            </button>
            <button
              formAction={deleteProblem.bind(null, problem.id)}
              className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </form>
      </details>
    </div>
  );
}
