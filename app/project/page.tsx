import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  addMilestoneTask,
  deleteMilestoneTask,
  toggleMilestoneTask,
  updateMilestone,
} from "@/lib/actions";
import { STATUSES, STATUS_LABELS } from "@/lib/constants";
import { linksToTextarea } from "@/lib/links";
import { pct } from "@/lib/progress";
import { Card, LinkChips, PageHeader, ProgressBar, StatusBadge } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";

export default async function ProjectPage() {
  const user = await requireUser();
  const milestones = await db.milestone.findMany({
    where: { userId: user.id },
    orderBy: { order: "asc" },
    include: { tasks: { orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <PageHeader
        title="Life Companion"
        subtitle="Flagship project milestones, from product definition to production."
      />
      <div className="mb-6 flex items-center gap-3">
        <ProgressBar value={pct(milestones)} className="max-w-xs" />
        <span className="text-sm text-zinc-500">
          {pct(milestones)}% of milestones
        </span>
      </div>

      <div className="grid gap-3">
        {milestones.map((m, i) => (
          <Card key={m.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">
                <span className="mr-2 font-mono text-xs text-zinc-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {m.name}
              </h2>
              <StatusBadge status={m.status} />
            </div>
            {m.notes && (
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-600">
                {m.notes}
              </p>
            )}
            <div className="mt-1.5">
              <LinkChips json={m.links} />
            </div>

            {m.tasks.length > 0 && (
              <ul className="mt-2 grid gap-1">
                {m.tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <form action={toggleMilestoneTask.bind(null, t.id)}>
                      <button
                        type="submit"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs ${
                          t.done
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-zinc-300 bg-white hover:border-zinc-500"
                        }`}
                        title={t.done ? "Mark not done" : "Mark done"}
                      >
                        {t.done ? "✓" : ""}
                      </button>
                    </form>
                    <span className={t.done ? "text-zinc-400 line-through" : ""}>
                      {t.title}
                    </span>
                    <form action={deleteMilestoneTask.bind(null, t.id)}>
                      <ConfirmButton
                        action={deleteMilestoneTask.bind(null, t.id)}
                        message={`Delete "${t.title}"?`}
                        aria-label={`Delete ${t.title}`}
                        className="p-1.5 text-xs text-zinc-300 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-zinc-500"
                      >
                        ✕
                      </ConfirmButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}

            <form
              action={addMilestoneTask.bind(null, m.id)}
              className="mt-2 flex items-center gap-2 text-sm"
            >
              <input
                name="title"
                aria-label={`Add implementation task to ${m.name}`}
                placeholder="Add implementation task…"
                required
                className="flex-1 rounded border border-zinc-300 px-2 py-1"
              />
              <button
                type="submit"
                className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
              >
                Add
              </button>
            </form>

            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700">
                Edit milestone
              </summary>
              <form
                action={updateMilestone.bind(null, m.id)}
                className="mt-2 grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm"
              >
                <label className="grid gap-1">
                  <span className="text-xs font-medium text-zinc-500">
                    Status
                  </span>
                  <select
                    name="status"
                    defaultValue={m.status}
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
                    Notes
                  </span>
                  <textarea
                    name="notes"
                    defaultValue={m.notes}
                    rows={3}
                    className="rounded border border-zinc-300 px-2 py-1"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-medium text-zinc-500">
                    Links: resources, commits, issues (Label | https://url)
                  </span>
                  <textarea
                    name="links"
                    defaultValue={linksToTextarea(m.links)}
                    rows={2}
                    className="rounded border border-zinc-300 px-2 py-1 font-mono text-xs"
                  />
                </label>
                <div>
                  <button
                    type="submit"
                    className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
}
