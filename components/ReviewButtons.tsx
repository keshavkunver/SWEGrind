import { reviewItem, type ReviewKind } from "@/lib/actions";

// "Again / Good / Easy" per due item; each schedules the next review via
// the interval ladder in lib/actions.ts.
export function ReviewButtons({ kind, id }: { kind: ReviewKind; id: string }) {
  const base =
    "rounded border px-3 py-2 text-xs font-medium cursor-pointer md:px-1.5 md:py-0.5 md:text-[11px]";
  return (
    <span className="inline-flex gap-2 md:gap-1">
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
