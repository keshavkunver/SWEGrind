import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { pct, countComplete } from "@/lib/progress";
import { WEEK_THEMES, TOTAL_WEEKS } from "@/lib/weeks";
import { Card, PageHeader, ProgressBar } from "@/components/ui";

export default async function RoadmapPage() {
  const user = await requireUser();
  const tasks = await db.task.findMany({
    where: { userId: user.id },
    orderBy: [{ week: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="Roadmap"
        subtitle="The 8-week plan. Open a week to see each day's lessons and track your progress."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((week) => {
          const weekTasks = tasks.filter((t) => t.week === week);
          const value = pct(weekTasks);
          return (
            <Link key={week} href={`/roadmap/${week}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-semibold">Week {week}</h2>
                  <span className="text-xs text-zinc-500">
                    {countComplete(weekTasks)}/{weekTasks.length} tasks
                  </span>
                </div>
                <p className="mt-1 mb-3 text-sm text-zinc-500">
                  {WEEK_THEMES[week]}
                </p>
                <ProgressBar value={value} />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
