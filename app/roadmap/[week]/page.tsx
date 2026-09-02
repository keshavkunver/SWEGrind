import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { addTask } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";
import { pct } from "@/lib/progress";
import { TOTAL_WEEKS, WEEK_THEMES } from "@/lib/weeks";
import { BackLink, Card, PageHeader, ProgressBar } from "@/components/ui";
import { TaskRow } from "@/components/TaskRow";
import { DraggableTaskList } from "@/components/DraggableTaskList";

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
  // Always show at least days that have tasks, plus one empty add slot per
  // missing day up to 7 via the picker below.

  return (
    <div>
      <BackLink href="/roadmap" label="Roadmap" />
      <PageHeader
        title={`Week ${week}`}
        subtitle={WEEK_THEMES[week]}
        action={
          <div className="flex items-center gap-2 text-sm">
            {week > 1 && (
              <Link href={`/roadmap/${week - 1}`} className="text-zinc-500 hover:text-zinc-900">
                ← Week {week - 1}
              </Link>
            )}
            {week < TOTAL_WEEKS && (
              <Link href={`/roadmap/${week + 1}`} className="text-zinc-500 hover:text-zinc-900">
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
        {days.map((day) => {
          const dayTasks = tasks.filter((t) => t.day === day);
          return (
            <Card key={day}>
              <h2 className="mb-1 font-semibold">
                Day {day}
                <span className="ml-2 text-sm font-normal text-zinc-400">
                  {DAY_NAMES[day - 1] ?? ""}
                </span>
              </h2>
              <DraggableTaskList ids={dayTasks.map((t) => t.id)}>
                {dayTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </DraggableTaskList>
              <AddTaskForm week={week} day={day} />
            </Card>
          );
        })}
        {days.length === 0 && (
          <Card>
            <p className="text-sm text-zinc-500">No tasks this week yet.</p>
          </Card>
        )}
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-zinc-600">
            Add a task to another day
          </h2>
          <AddTaskForm week={week} day={0} withDayPicker />
        </Card>
      </div>
    </div>
  );
}

function AddTaskForm({
  week,
  day,
  withDayPicker = false,
}: {
  week: number;
  day: number;
  withDayPicker?: boolean;
}) {
  async function add(fd: FormData) {
    "use server";
    const chosenDay = withDayPicker
      ? parseInt((fd.get("day") as string) || "1", 10)
      : day;
    await addTask(week, chosenDay, fd);
  }
  return (
    <form action={add} className="mt-2 flex flex-wrap items-center gap-2 text-sm">
      {withDayPicker && (
        <select
          name="day"
          aria-label="Day"
          className="rounded border border-zinc-300 bg-white px-2 py-1"
          defaultValue="1"
        >
          {DAY_NAMES.map((name, i) => (
            <option key={i} value={i + 1}>
              Day {i + 1} ({name})
            </option>
          ))}
        </select>
      )}
      <input
        name="title"
        aria-label="Task title"
        placeholder="Add a task…"
        required
        className="min-w-40 flex-1 rounded border border-zinc-300 px-2 py-1"
      />
      <select
        name="category"
        aria-label="Category"
        className="rounded border border-zinc-300 bg-white px-2 py-1"
        defaultValue="Engineering"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {CATEGORY_LABELS[c]}
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
  );
}
