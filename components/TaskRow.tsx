import type { Task } from "@prisma/client";
import {
  cycleTaskStatus,
  deleteTask,
  updateTask,
} from "@/lib/actions";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";
import { linksToTextarea } from "@/lib/links";
import { fmtDate } from "@/lib/progress";
import { CategoryBadge, LinkChips, StatusCycler } from "@/components/ui";

export function TaskRow({ task }: { task: Task }) {
  return (
    <div className="border-b border-zinc-100 py-3 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <StatusCycler
          status={task.status}
          action={cycleTaskStatus.bind(null, task.id)}
        />
        <span
          className={`font-medium ${task.status === "complete" ? "text-zinc-400 line-through" : ""}`}
        >
          {task.title}
        </span>
        <CategoryBadge category={task.category} />
        {task.estMinutes && (
          <span className="text-xs text-zinc-400">~{task.estMinutes}m</span>
        )}
        {task.nextReviewAt && (
          <span className="text-xs text-violet-600">
            review {fmtDate(task.nextReviewAt)}
          </span>
        )}
      </div>
      {task.description && (
        <p className="mt-1 text-sm text-zinc-500">{task.description}</p>
      )}
      <div className="mt-1.5">
        <LinkChips json={task.links} />
      </div>
      {task.notes && (
        <p className="mt-1.5 whitespace-pre-wrap rounded bg-amber-50 px-2 py-1 text-sm text-zinc-700">
          {task.notes}
        </p>
      )}
      <details className="mt-1.5">
        <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700">
          Edit task
        </summary>
        <form
          action={updateTask.bind(null, task.id)}
          className="mt-2 grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">Title</span>
              <input
                name="title"
                defaultValue={task.title}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">Category</span>
              <select
                name="category"
                defaultValue={task.category}
                className="rounded border border-zinc-300 bg-white px-2 py-1"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Estimated minutes
              </span>
              <input
                name="estMinutes"
                type="number"
                defaultValue={task.estMinutes ?? ""}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Next review date
              </span>
              <input
                name="nextReviewAt"
                type="date"
                defaultValue={fmtDate(task.nextReviewAt)}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">Description</span>
            <textarea
              name="description"
              defaultValue={task.description}
              rows={2}
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">
              Links (one per line: Label | https://url)
            </span>
            <textarea
              name="links"
              defaultValue={linksToTextarea(task.links)}
              rows={2}
              className="rounded border border-zinc-300 px-2 py-1 font-mono text-xs"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">Notes</span>
            <textarea
              name="notes"
              defaultValue={task.notes}
              rows={2}
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Practice items
              </span>
              <textarea
                name="practice"
                defaultValue={task.practice}
                rows={2}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Recall questions
              </span>
              <textarea
                name="recall"
                defaultValue={task.recall}
                rows={2}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save
            </button>
            <button
              formAction={deleteTask.bind(null, task.id)}
              className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </form>
      </details>
      {(task.practice || task.recall) && (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700">
            Practice & recall
          </summary>
          <div className="mt-1 grid gap-2 text-sm sm:grid-cols-2">
            {task.practice && (
              <div className="rounded bg-zinc-50 p-2">
                <p className="text-xs font-semibold text-zinc-500">Practice</p>
                <p className="whitespace-pre-wrap">{task.practice}</p>
              </div>
            )}
            {task.recall && (
              <div className="rounded bg-zinc-50 p-2">
                <p className="text-xs font-semibold text-zinc-500">Recall</p>
                <p className="whitespace-pre-wrap">{task.recall}</p>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}
