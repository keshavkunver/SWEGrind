import { db } from "@/lib/db";
import { createResource, deleteResource } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { RESOURCE_TYPES } from "@/lib/constants";
import { RESOURCES } from "@/lib/curriculum";
import { Card, PageHeader } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";

// One display shape for both sources: curriculum entries render from code
// (not deletable), the learner's own additions come from the database.
type Entry = {
  id: string | null; // null = curriculum entry
  title: string;
  url: string;
  type: string;
  topic: string;
  description: string;
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const user = await requireUser();
  const userResources = await db.resource.findMany({
    where: { userId: user.id },
    orderBy: [{ topic: "asc" }, { title: "asc" }],
  });

  const entries: Entry[] = [
    ...RESOURCES.map(([title, url, type, topic, description]) => ({
      id: null,
      title,
      url,
      type,
      topic,
      description,
    })),
    ...userResources,
  ];

  const needle = q.toLowerCase();
  const visible = q
    ? entries.filter((e) =>
        [e.title, e.topic, e.description].some((s) =>
          s.toLowerCase().includes(needle)
        )
      )
    : entries;

  const topics = [...new Set(visible.map((e) => e.topic || "General"))].sort();

  return (
    <div>
      <PageHeader
        title="Resources"
        subtitle="The curriculum library plus anything you add yourself."
      />

      <form method="GET" className="mb-4 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Filter by title or topic…"
          className="w-full max-w-sm rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500"
        >
          Filter
        </button>
      </form>

      <Card className="mb-6">
        <h2 className="mb-2 font-semibold">Add resource</h2>
        <form action={createResource} className="grid gap-2 text-sm sm:grid-cols-2">
          <input
            name="title"
            aria-label="Title"
            placeholder="Title"
            required
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <input
            name="url"
            aria-label="URL"
            placeholder="https://…"
            required
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <select
            name="type"
            aria-label="Type"
            defaultValue="docs"
            className="rounded border border-zinc-300 bg-white px-2 py-1 capitalize"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            name="topic"
            aria-label="Topic"
            placeholder="Topic (e.g. React, System Design)"
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <input
            name="description"
            aria-label="Short description"
            placeholder="Short description"
            className="rounded border border-zinc-300 px-2 py-1 sm:col-span-2"
          />
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-500"
            >
              Add
            </button>
          </div>
        </form>
      </Card>

      {topics.map((topic) => (
        <div key={topic} className="mb-5">
          <h2 className="mb-2 text-sm font-semibold text-zinc-600">{topic}</h2>
          <div className="grid gap-2">
            {visible
              .filter((e) => (e.topic || "General") === topic)
              .map((e) => (
                <Card
                  key={e.id ?? e.url}
                  className="flex min-w-0 items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-700 hover:underline"
                    >
                      {e.title} ↗
                    </a>
                    <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] capitalize text-zinc-600">
                      {e.type}
                    </span>
                    {e.description && (
                      <p className="mt-0.5 truncate text-sm text-zinc-500">
                        {e.description}
                      </p>
                    )}
                  </div>
                  {e.id && (
                    <form action={deleteResource.bind(null, e.id)}>
                      <ConfirmButton
                        action={deleteResource.bind(null, e.id)}
                        message={`Delete resource "${e.title}"?`}
                        aria-label={`Delete ${e.title}`}
                        className="p-3 text-xs text-zinc-300 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-zinc-500 md:p-1.5"
                      >
                        ✕
                      </ConfirmButton>
                    </form>
                  )}
                </Card>
              ))}
          </div>
        </div>
      ))}
      {visible.length === 0 && (
        <p className="text-sm text-zinc-400">
          {q ? `Nothing matching “${q}”.` : "No resources yet."}
        </p>
      )}
    </div>
  );
}
