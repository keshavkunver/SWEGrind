import { db } from "@/lib/db";

// Optional association pickers for a note. Server component: loads the
// (small, local) entity lists directly.
export async function NoteLinkFields({
  userId,
  defaults = {},
}: {
  userId: string;
  defaults?: {
    taskId?: string | null;
    patternId?: string | null;
    problemId?: string | null;
    sdTopicId?: string | null;
    milestoneId?: string | null;
  };
}) {
  const where = { userId };
  const [tasks, patterns, problems, topics, milestones] = await Promise.all([
    db.task.findMany({ where, orderBy: [{ week: "asc" }, { day: "asc" }] }),
    db.pattern.findMany({ where, orderBy: { order: "asc" } }),
    db.problem.findMany({ where, orderBy: { name: "asc" } }),
    db.sdTopic.findMany({ where, orderBy: { order: "asc" } }),
    db.milestone.findMany({ where, orderBy: { order: "asc" } }),
  ]);

  const selectCls =
    "rounded border border-zinc-300 bg-white px-2 py-1 text-sm w-full";

  return (
    <details>
      <summary className="cursor-pointer text-xs text-zinc-400 hover:text-zinc-700">
        Link to roadmap task, pattern, problem, topic, or milestone
      </summary>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-500">Roadmap task</span>
          <select name="taskId" defaultValue={defaults.taskId ?? ""} className={selectCls}>
            <option value="">None</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                W{t.week}D{t.day}: {t.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-500">Pattern</span>
          <select name="patternId" defaultValue={defaults.patternId ?? ""} className={selectCls}>
            <option value="">None</option>
            {patterns.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-500">Problem</span>
          <select name="problemId" defaultValue={defaults.problemId ?? ""} className={selectCls}>
            <option value="">None</option>
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-500">
            System design topic
          </span>
          <select name="sdTopicId" defaultValue={defaults.sdTopicId ?? ""} className={selectCls}>
            <option value="">None</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-medium text-zinc-500">Milestone</span>
          <select name="milestoneId" defaultValue={defaults.milestoneId ?? ""} className={selectCls}>
            <option value="">None</option>
            {milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </details>
  );
}
