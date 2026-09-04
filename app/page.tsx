import Link from "next/link";
import { db } from "@/lib/db";
import { cycleTaskStatus } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed-user";
import { countComplete, endOfToday, pct } from "@/lib/progress";
import { ReviewButtons } from "@/components/ReviewButtons";
import { currentPosition } from "@/lib/weeks";
import {
  Card,
  CategoryBadge,
  PageHeader,
  ProgressBar,
  StatusCycler,
} from "@/components/ui";

export default async function DashboardPage() {
  const user = await requireUser();
  await ensureSeeded(user.id);

  const where = { userId: user.id };
  const reviewCutoff = endOfToday();
  const [tasks, patterns, problems, sdTopics, milestones] = await Promise.all([
    db.task.findMany({ where }),
    db.pattern.findMany({ where }),
    db.problem.findMany({ where }),
    db.sdTopic.findMany({ where }),
    db.milestone.findMany({ where }),
  ]);

  const { week, day, started } = currentPosition();
  const todayTasks = tasks
    .filter((t) => t.week === week && t.day === day)
    .sort((a, b) => a.order - b.order);

  const overall = pct(tasks);
  const interviewTasks = tasks.filter((t) => t.category === "InterviewPrep");
  const engineeringTasks = tasks.filter(
    (t) => t.category === "Engineering" || t.category === "AIEngineering"
  );
  const careerTasks = tasks.filter((t) => t.category === "Career");
  const interviewReady = patterns.filter(
    (p) => p.confidence === "interview_ready"
  ).length;

  const dueTasks = tasks.filter(
    (t) => t.nextReviewAt && t.nextReviewAt <= reviewCutoff
  );
  const dueProblems = problems.filter(
    (p) => p.nextReviewAt && p.nextReviewAt <= reviewCutoff
  );
  const dueTopics = sdTopics.filter(
    (t) => t.nextReviewAt && t.nextReviewAt <= reviewCutoff
  );
  const dueCount = dueTasks.length + dueProblems.length + dueTopics.length;

  const tiles = [
    {
      label: "Interview prep",
      value: pct([...interviewTasks, ...problems]),
      detail: `${interviewReady}/${patterns.length} patterns interview ready`,
      href: "/interview",
    },
    {
      label: "Engineering",
      value: pct(engineeringTasks),
      detail: `${engineeringTasks.length} learning tasks`,
      href: "/roadmap",
    },
    {
      label: "System design",
      value: pct(sdTopics),
      detail: `${sdTopics.length} topics`,
      href: "/system-design",
    },
    {
      label: "Life Companion",
      value: pct(milestones),
      detail: `${countComplete(milestones)} of ${milestones.length} milestones done`,
      href: "/project",
    },
    {
      label: "Job search",
      value: pct(careerTasks),
      detail: `${careerTasks.length} career tasks`,
      href: "/roadmap",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={
          started
            ? `Week ${week}, Day ${day} of the 8-week plan`
            : `Plan starts soon. You're on Week 1, Day 1.`
        }
      />

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Overall progress</h2>
          <span className="text-2xl font-bold">{overall}%</span>
        </div>
        <ProgressBar value={overall} className="mt-2" />
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}>
            <Card className="h-full py-3 transition-shadow hover:shadow-md">
              <p className="text-xs font-medium text-zinc-500">{tile.label}</p>
              <p className="mt-1 text-xl font-bold">{tile.value}%</p>
              <ProgressBar value={tile.value} className="mt-1.5" />
              <p className="mt-1.5 text-[11px] text-zinc-400">{tile.detail}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold">Today: Week {week}, Day {day}</h2>
            <Link
              href={`/roadmap/${week}`}
              className="text-xs font-medium text-blue-700 hover:underline"
            >
              Open week {week} →
            </Link>
          </div>
          {todayTasks.length === 0 && (
            <p className="text-sm text-zinc-400">
              No tasks scheduled for today.{" "}
              <Link href={`/roadmap/${week}`} className="text-blue-700 hover:underline">
                Add some in week {week}.
              </Link>
            </p>
          )}
          {todayTasks.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center gap-2 border-b border-zinc-100 py-2 last:border-b-0"
            >
              <StatusCycler
                status={t.status}
                action={cycleTaskStatus.bind(null, t.id)}
              />
              <span
                className={
                  t.status === "complete" ? "text-zinc-400 line-through" : ""
                }
              >
                {t.title}
              </span>
              <CategoryBadge category={t.category} />
              {t.estMinutes && (
                <span className="text-xs text-zinc-400">~{t.estMinutes}m</span>
              )}
            </div>
          ))}
        </Card>

        <Card>
          <h2 className="mb-2 font-semibold">
            Due for review{" "}
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                dueCount > 0
                  ? "bg-violet-100 text-violet-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {dueCount}
            </span>
          </h2>
          {dueCount === 0 && (
            <p className="text-sm text-zinc-400">
              Nothing due yet. Completing problems and topics schedules
              reviews here automatically.
            </p>
          )}
          <div className="grid gap-1.5 text-sm">
            {dueProblems.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                    {p.name} ↗
                  </a>
                ) : (
                  <span>{p.name}</span>
                )}
                <ReviewButtons kind="problem" id={p.id} />
              </div>
            ))}
            {dueTopics.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/system-design/${t.slug}`} className="hover:underline">
                  {t.name}
                </Link>
                <ReviewButtons kind="sdTopic" id={t.id} />
              </div>
            ))}
            {dueTasks.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/roadmap/${t.week}`} className="hover:underline">
                  {t.title}
                </Link>
                <ReviewButtons kind="task" id={t.id} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-2 font-semibold">Continue</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href={`/roadmap/${week}`}
            className="rounded-md bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-700"
          >
            Today&apos;s work →
          </Link>
          <Link
            href="/interview"
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-medium hover:bg-zinc-100"
          >
            Interview prep
          </Link>
          <Link
            href="/system-design"
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-medium hover:bg-zinc-100"
          >
            System design
          </Link>
          <Link
            href="/project"
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 font-medium hover:bg-zinc-100"
          >
            Life Companion
          </Link>
        </div>
      </Card>
    </div>
  );
}
