import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { cycleSdTopicStatus, updateSdTopicNotes } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { fmtDate } from "@/lib/progress";
import { BackLink, Card, LinkChips, PageHeader, StatusCycler } from "@/components/ui";

export default async function SdTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const topic = await db.sdTopic.findFirst({
    where: { slug, userId: user.id },
  });
  if (!topic) notFound();

  return (
    <div>
      <BackLink href="/system-design" label="System Design" />
      <PageHeader
        title={topic.name}
        subtitle={
          topic.nextReviewAt
            ? `Review scheduled for ${fmtDate(topic.nextReviewAt)}`
            : "Mark complete when you can answer the recall questions cold."
        }
        action={
          <StatusCycler
            status={topic.status}
            action={cycleSdTopicStatus.bind(null, topic.id)}
          />
        }
      />

      <Card className="mb-4">
        <h2 className="mb-2 text-sm font-semibold text-zinc-600">Learn</h2>
        <LinkChips json={topic.links} />
      </Card>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        {topic.practice && (
          <Card>
            <h2 className="mb-1 text-sm font-semibold text-zinc-600">
              Practice
            </h2>
            <p className="whitespace-pre-wrap text-sm text-zinc-700">
              {topic.practice}
            </p>
          </Card>
        )}
        {topic.recall && (
          <Card>
            <h2 className="mb-1 text-sm font-semibold text-zinc-600">
              Recall questions
            </h2>
            <p className="whitespace-pre-wrap text-sm text-zinc-700">
              {topic.recall}
            </p>
          </Card>
        )}
      </div>

      <Card>
        <h2 className="mb-2 text-sm font-semibold text-zinc-600">My notes</h2>
        <form
          action={updateSdTopicNotes.bind(null, topic.id)}
          className="grid gap-2 text-sm"
        >
          <textarea
            name="notes"
            aria-label="My notes"
            defaultValue={topic.notes}
            rows={6}
            placeholder="Key concepts, tradeoffs, mental models…"
            className="rounded border border-zinc-300 px-2 py-1"
          />
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save notes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
