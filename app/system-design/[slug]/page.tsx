import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateSdTopic } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { STATUSES, STATUS_LABELS } from "@/lib/constants";
import { linksToTextarea } from "@/lib/links";
import { fmtDate } from "@/lib/progress";
import { BackLink, Card, LinkChips, PageHeader, StatusBadge } from "@/components/ui";

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
        action={<StatusBadge status={topic.status} />}
      />
      <div className="mb-4">
        <LinkChips json={topic.links} />
      </div>

      <Card>
        <form
          action={updateSdTopic.bind(null, topic.id)}
          className="grid gap-3 text-sm"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">Status</span>
              <select
                name="status"
                defaultValue={topic.status}
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
                Next review date
              </span>
              <input
                name="nextReviewAt"
                type="date"
                defaultValue={fmtDate(topic.nextReviewAt)}
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">
              Learning links (one per line: Label | https://url)
            </span>
            <textarea
              name="links"
              defaultValue={linksToTextarea(topic.links)}
              rows={3}
              className="rounded border border-zinc-300 px-2 py-1 font-mono text-xs"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-medium text-zinc-500">Notes</span>
            <textarea
              name="notes"
              defaultValue={topic.notes}
              rows={6}
              placeholder="Key concepts, tradeoffs, mental models…"
              className="rounded border border-zinc-300 px-2 py-1"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Practice design questions
              </span>
              <textarea
                name="practice"
                defaultValue={topic.practice}
                rows={4}
                placeholder="Design questions to work through…"
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-medium text-zinc-500">
                Recall questions
              </span>
              <textarea
                name="recall"
                defaultValue={topic.recall}
                rows={4}
                placeholder="Questions to test yourself with later…"
                className="rounded border border-zinc-300 px-2 py-1"
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
            >
              Save topic
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
