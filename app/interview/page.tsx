import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { pct, countComplete, derivedStatus } from "@/lib/progress";
import { STAR_STEPS, STAR_STORY_PROMPTS, UMPIRE_STEPS } from "@/lib/curriculum";
import { Card, ConfidenceBadge, PageHeader, ProgressBar, StatusBadge } from "@/components/ui";

export default async function InterviewPage() {
  const user = await requireUser();
  const patterns = await db.pattern.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
    include: { problems: true },
  });

  const allProblems = patterns.flatMap((p) => p.problems);
  const core = allProblems.filter((p) => p.inCurriculum);
  const uniqueDone = countComplete(core);
  const attempts = allProblems.reduce((sum, p) => sum + p.attemptCount, 0);
  const interviewReady = patterns.filter(
    (p) => p.confidence === "interview_ready"
  ).length;

  const stats = [
    { label: "Unique problems", value: `${uniqueDone} / ${core.length}` },
    { label: "Practice attempts", value: `${attempts}` },
    { label: "Patterns interview ready", value: `${interviewReady} / ${patterns.length}` },
  ];

  return (
    <div>
      <PageHeader
        title="Interview Prep"
        subtitle="Learn by pattern, then practice. Mastery is the goal; problem checkmarks are just the trail."
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="py-3">
            <p className="text-xs font-medium text-zinc-500">{s.label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((p) => {
          const coreProblems = p.problems.filter((x) => x.inCurriculum);
          return (
            <Link key={p.id} href={`/interview/${p.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{p.name}</h2>
                  <StatusBadge status={derivedStatus(coreProblems)} />
                </div>
                <div className="mt-2">
                  <ConfidenceBadge confidence={p.confidence} />
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                  {countComplete(coreProblems)}/{coreProblems.length} problems solved
                </p>
                <ProgressBar value={pct(coreProblems)} className="mt-2" />
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">The UMPIRE method</h2>
          <p className="mb-2 text-xs text-zinc-400">
            Work every coding problem this way. By the later weeks, say it aloud
            under time pressure.
          </p>
          <ul className="grid gap-1.5 text-sm">
            {UMPIRE_STEPS.map((s) => (
              <li key={s.letter} className="flex gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-900 text-[11px] font-bold text-white">
                  {s.letter}
                </span>
                <span>
                  <span className="font-medium">{s.name}.</span>{" "}
                  <span className="text-zinc-600">{s.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-semibold">Behavioral: STAR + Learning</h2>
          <p className="mb-2 text-xs text-zinc-400">
            Separate from UMPIRE. Build one reusable story per prompt, starting
            week 3.
          </p>
          <ul className="grid gap-1.5 text-sm">
            {STAR_STEPS.map((s) => (
              <li key={s.name} className="flex gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-200 text-[11px] font-bold text-zinc-700">
                  {s.name[0]}
                </span>
                <span>
                  <span className="font-medium">{s.name}.</span>{" "}
                  <span className="text-zinc-600">{s.detail}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-medium text-zinc-500">Story bank</p>
          <p className="mt-1 text-xs text-zinc-500">
            {STAR_STORY_PROMPTS.join(" · ")}
          </p>
        </Card>
      </div>
    </div>
  );
}
