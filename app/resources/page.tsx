import { db } from "@/lib/db";
import { createResource, deleteResource } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { RESOURCE_TYPES } from "@/lib/constants";
import { Card, PageHeader } from "@/components/ui";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const user = await requireUser();
  const resources = await db.resource.findMany({
    where: {
      userId: user.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { topic: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: [{ topic: "asc" }, { title: "asc" }],
  });

  const topics = [...new Set(resources.map((r) => r.topic || "General"))];

  return (
    <div>
      <PageHeader
        title="Resources"
        subtitle="Central library of external learning resources."
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
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
        >
          Filter
        </button>
      </form>

      <Card className="mb-6">
        <h2 className="mb-2 font-semibold">Add resource</h2>
        <form action={createResource} className="grid gap-2 text-sm sm:grid-cols-2">
          <input
            name="title"
            placeholder="Title"
            required
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <input
            name="url"
            placeholder="https://…"
            required
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <select
            name="type"
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
            placeholder="Topic (e.g. React, System Design)"
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <input
            name="description"
            placeholder="Short description"
            className="rounded border border-zinc-300 px-2 py-1 sm:col-span-2"
          />
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
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
            {resources
              .filter((r) => (r.topic || "General") === topic)
              .map((r) => (
                <Card key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-700 hover:underline"
                    >
                      {r.title} ↗
                    </a>
                    <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] capitalize text-zinc-600">
                      {r.type}
                    </span>
                    {r.description && (
                      <p className="mt-0.5 truncate text-sm text-zinc-500">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <form action={deleteResource.bind(null, r.id)}>
                    <button
                      type="submit"
                      className="text-xs text-zinc-300 hover:text-red-500"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </form>
                </Card>
              ))}
          </div>
        </div>
      ))}
      {resources.length === 0 && (
        <p className="text-sm text-zinc-400">No resources yet.</p>
      )}
    </div>
  );
}
