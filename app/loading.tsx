// Route-level Suspense fallback: shows in the content area the moment any
// navigation starts (tab clicks included) while the server renders the
// page. The 150ms animation delay keeps fast transitions spinner-free so
// it only appears when there is a real wait.
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[50vh] flex-1 items-center justify-center"
      style={{ animation: "loading-fade 200ms 150ms both" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-6 w-6 animate-spin text-zinc-400"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  );
}
