import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updatePatternStudy } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { CONFIDENCE_LABELS, CONFIDENCE_LEVELS, PROBLEM_KINDS } from "@/lib/constants";
import { derivedStatus } from "@/lib/progress";
import { BackLink, Card, ConfidenceBadge, PageHeader, StatusBadge } from "@/components/ui";
import { ProblemRow } from "@/components/ProblemRow";

const KIND_TITLES: Record<string, string> = {
  guided: "Guided problems",
  independent: "Independent problems",
  review: "Review problems",
};

const KIND_HINTS: Record<string, string> = {
  guided: "Work through these with the solution or a walkthrough nearby.",
  independent: "Solve these on your own before looking anything up.",
  review: "Problems that came back through spaced review.",
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
            <StatusBadge status={derivedStatus(pattern.problems)} />
            <ConfidenceBadge confidence={pattern.confidence} />
          </div>
        }
      />

      {pattern.signals && (
        <Card className="mb-4">
          <h2 className="mb-1 text-sm font-semibold text-zinc-600">
            When to reach for this pattern
          </h2>
          <p className="text-sm text-zinc-700">{pattern.signals}</p>
        </Card>
      )}

      {PROBLEM_KINDS.map((kind) => {
        const problems = pattern.problems.filter((p) => p.kind === kind);
        if (kind === "review" && problems.length === 0) return null;
        return (
          <Card key={kind} className="mb-4">
            <h2 className="font-semibold">{KIND_TITLES[kind]}</h2>
            <p className="mb-1 text-xs text-zinc-400">{KIND_HINTS[kind]}</p>
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
        <h2 className="mb-2 font-semibold">My study notes</h2>
        <form
          action={updatePatternStudy.bind(null, pattern.id)}
          className="grid gap-3 text-sm"
        >
          <label className="grid gap-1 sm:max-w-xs">
            <span className="text-xs font-medium text-zinc-500">
              How confident are you with this pattern?
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
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">Notes</span>
            <textarea
              name="notes"
              defaultValue={pattern.notes}
              rows={4}
              placeholder="Template code, key insights, mistakes to avoid…"
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
