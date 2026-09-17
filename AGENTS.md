## Shared workspace instructions

Before working in this repository, read `../AGENTS.md`.
Resolve these paths from this file's directory. These references are explicit
because parent rules may not load when this repo is opened directly. Read each
file once; do not recurse through instruction references. If this is a standalone
clone or worktree and a referenced file is absent, report the missing context
and continue with available instructions and the user's request.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
