import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { pct } from "@/lib/progress";
import { TOTAL_WEEKS, WEEK_THEMES } from "@/lib/weeks";
import { BackLink, Card, PageHeader, ProgressBar } from "@/components/ui";
import { TaskRow } from "@/components/TaskRow";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week: weekParam } = await params;
  const week = parseInt(weekParam, 10);
  if (!week || week < 1 || week > TOTAL_WEEKS) notFound();

  const user = await requireUser();
  const tasks = await db.task.findMany({
    where: { week, userId: user.id },
    orderBy: [{ day: "asc" }, { order: "asc" }],
  });
  const days = [...new Set(tasks.map((t) => t.day))].sort((a, b) => a - b);

  return (
    <div>
      <BackLink href="/roadmap" label="Roadmap" />
      <PageHeader
        title={`Week ${week}`}
        subtitle={WEEK_THEMES[week]}
        action={
          <div className="flex items-center gap-2 text-sm">
            {week > 1 && (
              <Link
                href={`/roadmap/${week - 1}`}
                className="text-zinc-500 hover:text-zinc-900"
              >
                ← Week {week - 1}
              </Link>
            )}
            {week < TOTAL_WEEKS && (
              <Link
                href={`/roadmap/${week + 1}`}
                className="text-zinc-500 hover:text-zinc-900"
              >
                Week {week + 1} →
              </Link>
            )}
          </div>
        }
      />
      <div className="mb-6 flex items-center gap-3">
        <ProgressBar value={pct(tasks)} className="max-w-xs" />
        <span className="text-sm text-zinc-500">{pct(tasks)}%</span>
      </div>

      <div className="grid gap-4">
        {days.map((day) => (
          <Card key={day}>
            <h2 className="mb-1 font-semibold">
              Day {day}
              <span className="ml-2 text-sm font-normal text-zinc-400">
                {DAY_NAMES[day - 1] ?? ""}
              </span>
            </h2>
            {tasks
              .filter((t) => t.day === day)
              .map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
          </Card>
        ))}
        {days.length === 0 && (
          <Card>
            <p className="text-sm text-zinc-500">No lessons this week.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
