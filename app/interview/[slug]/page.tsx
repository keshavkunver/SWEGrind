import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { addProblem, updatePattern } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import {
  CONFIDENCE_LABELS,
  CONFIDENCE_LEVELS,
  DIFFICULTIES,
  PROBLEM_KINDS,
  STATUSES,
  STATUS_LABELS,
} from "@/lib/constants";
import { BackLink, Card, ConfidenceBadge, PageHeader, StatusBadge } from "@/components/ui";
import { ProblemRow } from "@/components/ProblemRow";

const KIND_TITLES: Record<string, string> = {
  guided: "Guided problems",
  independent: "Independent problems",
  review: "Review problems",
};

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const pattern = await db.pattern.findFirst({
    where: { slug, userId: user.id },
    include: { problems: { orderBy: { name: "asc" } } },
  });
  if (!pattern) notFound();

  return (
    <div>
      <BackLink href="/interview" label="Interview Prep" />
      <PageHeader
        title={pattern.name}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={pattern.status} />
            <ConfidenceBadge confidence={pattern.confidence} />
          </div>
        }
      />

      <Card className="mb-4">
        <form
          action={updatePattern.bind(null, pattern.id)}
          className="grid gap-3 text-sm"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">Status</span>
              <select
                name="status"
                defaultValue={pattern.status}
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
                defaultValue={pattern.confidence}
                className="rounded border border-zinc-300 bg-white px-2 py-1"
              >
                {CONFIDENCE_LEVELS.map((c) => (
                  <option key={c} value={c}>
                    {CONFIDENCE_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">
              Explanation / notes
            </span>
            <textarea
              name="notes"
              defaultValue={pattern.notes}
              rows={4}
              placeholder="How this pattern works, template code, key insights…"
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">
              Recognition signals
            </span>
            <textarea
              name="signals"
              defaultValue={pattern.signals}
              rows={3}
              placeholder="When to reach for this pattern: input shapes, keywords, constraints…"
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save pattern
            </button>
          </div>
        </form>
      </Card>

      {PROBLEM_KINDS.map((kind) => {
        const problems = pattern.problems.filter((p) => p.kind === kind);
        return (
          <Card key={kind} className="mb-4">
            <h2 className="mb-1 font-semibold">{KIND_TITLES[kind]}</h2>
            {problems.length === 0 && (
              <p className="py-2 text-sm text-zinc-400">None yet.</p>
            )}
            {problems.map((p) => (
              <ProblemRow key={p.id} problem={p} />
            ))}
          </Card>
        );
      })}

      <Card>
        <h2 className="mb-2 font-semibold">Add problem</h2>
        <form
          action={addProblem.bind(null, pattern.id)}
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          <input
            name="name"
            placeholder="Problem name"
            required
            className="min-w-40 flex-1 rounded border border-zinc-300 px-2 py-1"
          />
          <input
            name="url"
            placeholder="https://leetcode.com/problems/…"
            className="min-w-40 flex-1 rounded border border-zinc-300 px-2 py-1"
          />
          <select
            name="kind"
            defaultValue="independent"
            className="rounded border border-zinc-300 bg-white px-2 py-1 capitalize"
          >
            {PROBLEM_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <select
            name="difficulty"
            defaultValue="medium"
            className="rounded border border-zinc-300 bg-white px-2 py-1 capitalize"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
          >
            Add
          </button>
        </form>
      </Card>
    </div>
  );
}
