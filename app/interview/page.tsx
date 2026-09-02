import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { pct, countComplete } from "@/lib/progress";
import { Card, ConfidenceBadge, PageHeader, ProgressBar, StatusBadge } from "@/components/ui";

export default async function InterviewPage() {
  const user = await requireUser();
  const patterns = await db.pattern.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
    include: { problems: true },
  });

  return (
    <div>
      <PageHeader
        title="Interview Prep"
        subtitle="Learn by pattern. Open a pattern to track problems, notes, and recognition signals."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((p) => (
          <Link key={p.id} href={`/interview/${p.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{p.name}</h2>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-2">
                <ConfidenceBadge confidence={p.confidence} />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                {countComplete(p.problems)}/{p.problems.length} problems solved
              </p>
              <ProgressBar value={pct(p.problems)} className="mt-2" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
