import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { SD_TOPIC_CONTENT } from "@/lib/curriculum";
import { pct } from "@/lib/progress";
import { Card, PageHeader, ProgressBar, StatusBadge } from "@/components/ui";

export default async function SystemDesignPage() {
  const user = await requireUser();
  const topics = await db.sdTopic.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="System Design"
        subtitle="A structured path through core concepts. Open a topic for notes, links, and practice questions."
      />
      <div className="mb-6 flex items-center gap-3">
        <ProgressBar value={pct(topics)} className="max-w-xs" />
        <span className="text-sm text-zinc-500">{pct(topics)}% of topics</span>
      </div>
      <div className="grid gap-2">
        {topics.map((t, i) => (
          <Link key={t.id} href={`/system-design/${t.slug}`}>
            <Card className="flex items-center justify-between gap-3 py-3 transition-shadow hover:shadow-md">
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-6 shrink-0 text-right font-mono text-xs text-zinc-400">
                  {i + 1}
                </span>
                <span className="truncate font-medium">{t.name}</span>
                {(SD_TOPIC_CONTENT[t.name]?.links.length ?? 0) > 0 && (
                  <span className="hidden text-xs text-zinc-400 sm:inline">
                    {SD_TOPIC_CONTENT[t.name].links.length} links
                  </span>
                )}
              </div>
              <StatusBadge status={t.status} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
