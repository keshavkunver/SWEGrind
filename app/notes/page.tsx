import Link from "next/link";
import { db } from "@/lib/db";
import { createNote } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { Card, PageHeader } from "@/components/ui";
import { NoteLinkFields } from "@/components/NoteLinkFields";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const user = await requireUser();
  const notes = await db.note.findMany({
    where: {
      userId: user.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { body: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      task: true,
      pattern: true,
      problem: true,
      sdTopic: true,
      milestone: true,
    },
  });

  return (
    <div>
      <PageHeader title="Notes" subtitle="Searchable notes, in Markdown." />

      <form method="GET" className="mb-4 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search notes…"
          className="w-full max-w-sm rounded border border-zinc-300 bg-white px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
        >
          Search
        </button>
      </form>

      <Card className="mb-6">
        <h2 className="mb-2 font-semibold">New note</h2>
        <form action={createNote} className="grid gap-2 text-sm">
          <input
            name="title"
            placeholder="Title"
            required
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <textarea
            name="body"
            rows={4}
            placeholder="Write in Markdown…"
            className="rounded border border-zinc-300 px-2 py-1 font-mono text-xs"
          />
          <NoteLinkFields userId={user.id} />
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Create note
            </button>
          </div>
        </form>
      </Card>

      <div className="grid gap-2">
        {notes.length === 0 && (
          <p className="text-sm text-zinc-400">
            {q ? `No notes matching "${q}".` : "No notes yet."}
          </p>
        )}
        {notes.map((n) => {
          const assoc =
            n.task?.title ??
            n.pattern?.name ??
            n.problem?.name ??
            n.sdTopic?.name ??
            n.milestone?.name;
          return (
            <Link key={n.id} href={`/notes/${n.id}`}>
              <Card className="py-3 transition-shadow hover:shadow-md">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-medium">{n.title}</h3>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {n.updatedAt.toISOString().slice(0, 10)}
                  </span>
                </div>
                {assoc && (
                  <span className="mt-1 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600">
                    {assoc}
                  </span>
                )}
                {n.body && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                    {n.body}
                  </p>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
