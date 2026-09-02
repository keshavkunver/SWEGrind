import type { Task } from "@prisma/client";
import { cycleTaskStatus, updateTaskNotes } from "@/lib/actions";
import { CategoryBadge, LinkChips, StatusCycler } from "@/components/ui";

// A roadmap lesson. The lesson itself is curriculum content; the learner
// marks progress and keeps notes.
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
      </div>
      {task.description && (
        <p className="mt-1 text-sm text-zinc-500">{task.description}</p>
      )}
      <div className="mt-1.5">
        <LinkChips json={task.links} />
      </div>
      {(task.practice || task.recall) && (
        <details className="mt-1.5">
          <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700">
            Practice &amp; recall
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
      <details className="mt-1.5">
        <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700">
          {task.notes ? "My notes" : "Add a note"}
        </summary>
        <form
          action={updateTaskNotes.bind(null, task.id)}
          className="mt-2 grid gap-2"
        >
          <textarea
            name="notes"
            aria-label="My notes"
            defaultValue={task.notes}
            rows={3}
            placeholder="What you learned, what tripped you up…"
            className="rounded border border-zinc-300 px-2 py-1 text-sm"
          />
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save note
            </button>
          </div>
        </form>
      </details>
      {task.notes && (
        <p className="mt-1.5 whitespace-pre-wrap rounded bg-amber-50 px-2 py-1 text-sm text-zinc-700">
          {task.notes}
        </p>
      )}
    </div>
  );
}
