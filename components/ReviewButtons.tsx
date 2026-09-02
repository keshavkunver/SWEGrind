import { reviewItem, type ReviewKind } from "@/lib/actions";

// "Again / Good / Easy" per due item; each schedules the next review via
// the interval ladder in lib/actions.ts.
export function ReviewButtons({ kind, id }: { kind: ReviewKind; id: string }) {
  const base =
    "rounded border px-1.5 py-0.5 text-[11px] font-medium cursor-pointer";
  return (
    <span className="inline-flex gap-1">
      <form action={reviewItem.bind(null, kind, id, "again")}>
        <button
          type="submit"
          title="Didn't remember: review again tomorrow"
          className={`${base} border-red-200 text-red-600 hover:bg-red-50`}
        >
          Again
        </button>
      </form>
      <form action={reviewItem.bind(null, kind, id, "good")}>
        <button
          type="submit"
          title="Remembered: next step up the interval ladder"
          className={`${base} border-zinc-300 text-zinc-600 hover:bg-zinc-100`}
        >
          Good
        </button>
      </form>
      <form action={reviewItem.bind(null, kind, id, "easy")}>
        <button
          type="submit"
          title="Knew it cold: skip a step"
          className={`${base} border-emerald-200 text-emerald-700 hover:bg-emerald-50`}
        >
          Easy
        </button>
      </form>
    </span>
  );
}
