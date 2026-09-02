import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { db } from "@/lib/db";
import { deleteNote, updateNote } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { BackLink, Card, PageHeader } from "@/components/ui";
import { NoteLinkFields } from "@/components/NoteLinkFields";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const note = await db.note.findFirst({ where: { id, userId: user.id } });
  if (!note) notFound();

  return (
    <div>
      <BackLink href="/notes" label="Notes" />
      <PageHeader
        title={note.title}
        subtitle={`Last updated ${note.updatedAt.toISOString().slice(0, 10)}`}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-zinc-600">Edit</h2>
          <form action={updateNote.bind(null, note.id)} className="grid gap-2 text-sm">
            <input
              name="title"
              defaultValue={note.title}
              className="rounded border border-zinc-300 px-2 py-1"
            />
            <textarea
              name="body"
              defaultValue={note.body}
              rows={16}
              className="rounded border border-zinc-300 px-2 py-1 font-mono text-xs"
            />
            <NoteLinkFields
              userId={user.id}
              defaults={{
                taskId: note.taskId,
                patternId: note.patternId,
                problemId: note.problemId,
                sdTopicId: note.sdTopicId,
                milestoneId: note.milestoneId,
              }}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
              >
                Save
              </button>
              <button
                formAction={deleteNote.bind(null, note.id)}
                className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </form>
        </Card>
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-zinc-600">Preview</h2>
          <div className="prose-note text-sm">
            <ReactMarkdown>{note.body || "*Nothing here yet.*"}</ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
}
