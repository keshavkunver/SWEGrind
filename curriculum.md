# SWE Grind: Canonical 8-Week Curriculum (v2)

Source of truth for the curriculum DATA is `lib/curriculum.ts` (patterns,
problems, signals, tasks, resources). This document is the source of truth
for the curriculum DESIGN: what the numbers mean and the rules any future
revision must keep. Updated 2026-09-04 from the v2 spec.

## Primary goal

Become interview-ready for a materially higher-paying SWE / Full Stack /
AI Product Engineer role as fast as possible while building practical AI
engineering capability. Optimized for getting an offer, not completing
courses. Success is defined by capability, not checkmarks: recognize the
22 patterns, use UMPIRE, design systems, tell STAR + Learning stories,
ship and defend Life Companion, keep an active application pipeline.

## Three tracks, all parallel

- **Track A, pass the interview:** patterns, UMPIRE, system design,
  behavioral (STAR + Learning), communication.
- **Track B, do the job:** JS/TS, React, Next.js, APIs, PostgreSQL, auth,
  testing, Git, CI/CD, Docker (target mastery 4), Kubernetes (target 2-3,
  concepts only), AI engineering, AI-native development.
- **Track C, get the interview:** targeted applications from week 1
  (5-8/week ramping to 10-15+), networking, referrals, resume, LinkedIn,
  GitHub, mocks. Never let project-building consume interview prep, or
  course consumption replace applications.

## Interview curriculum architecture

- Exactly **22 core patterns** (see `PATTERNS`). Secondary patterns
  (cyclic sort, two heaps, k-way merge, bitwise XOR, advanced DP) must
  never dilute the core roadmap.
- Exactly **4 problems per pattern = 88 unique problems**, one per role:
  - **A Guided:** pattern known, walkthrough allowed
  - **B Supported independent:** pattern known, derive the algorithm
  - **C Independent:** harder or less obvious, minimal assistance
  - **D Transfer test:** identify the pattern yourself
- **Unique problems vs practice attempts are separate metrics.** Spaced
  re-solves add attempts (`Problem.attemptCount`) but never inflate the
  88 count (`Problem.inCurriculum` flags the core set).
- **Mastery is tracked separately from completion** (pattern confidence
  ladder 0-5, interview_ready = 5). Checking off four problems does not
  make a pattern mastered.
- **Learn the pattern before the problems.** Grokking-style lessons are
  the pattern teacher (selective use, never end-to-end completion);
  NeetCode is the problem bank; Coding Interview University is a
  supplemental reference. UMPIRE (Understand, Match, Plan, Implement,
  Review, Evaluate) is the standard method; Python is the interview
  language unless a target requires otherwise.
- **Scaffolding fades by week:** patterns named in weeks 1-2, less
  signposted in 3-4, mixed unlabeled problems in 5-6, timed unseen
  problems with UMPIRE aloud in 7-8.

## Pattern sequencing (recommended, not gates)

| Week | Patterns |
|---|---|
| 1 | Hash Maps / Sets, Two Pointers, begin Sliding Window |
| 2 | Sliding Window, Fast & Slow Pointers, Stack, Monotonic Stack, Modified Binary Search |
| 3 | In-place Linked List Reversal, Merge Intervals, Tree DFS, Tree BFS |
| 4 | Top-K / Heap, Graph BFS / DFS, Matrix / Islands |
| 5 | Topological Sort, Union Find, Subsets, Backtracking |
| 6 | Trie, Greedy, 1-D DP, begin 2-D DP |
| 7 | Complete 2-D DP, then mixed timed practice |
| 8 | Mocks: coding, system design, behavioral |

Weeks define sequencing, not calendar gates: **any milestone may be
completed early and stays completed.** Statuses are freely settable on
any week's items at any time; nothing re-locks when its scheduled week
arrives. Completion evidence (dates, attempts, notes) is retained.

## Engineering, AI, project

- Flagship project: **Life Companion**, a personal AI companion that
  turns goals, projects, tasks, and context into an approved weekly
  plan. Not a generic chatbot. Progression V0 (fake-data UI) through V8
  (verification, evals, observability, deployment, case study); Google
  Calendar is the preferred first integration. V1 entities: User, Goal,
  Project, Task, Weekly Review. Do not overbuild.
- AI engineering progression: LLM APIs, prompting, structured outputs,
  streaming, deterministic workflows, tool calling, embeddings/RAG,
  context engineering, memory, MCP, constrained agents, evals,
  verification, safety, human approval. Workflows before agents: never
  force an agent architecture where a deterministic sequence is simpler.
- AI-native development: Explore, Plan, Implement, Test, Review. AI
  tutors in learning mode, accelerates in project mode, and is
  progressively removed in interview mode.
- System design: ~2 sessions/week early, more as interviews approach.
  Framework: requirements, entities, API, data flow, high-level design,
  deep dives. Hello Interview is the spine.
- Daily budget (guideline): ~75m interview prep, ~2h engineering/project,
  ~30m AI, 15-30m career, SD 30-45m twice weekly. Roughly 4h/day.

## Integrity rules (any future revision must keep these)

1. No new mandatory topics; no resource becomes a required course
   (NeetCode 150, Grokking, CIU, CS329A are never completion targets).
2. Kubernetes stays light (concepts, one simple deployment if practical).
3. Watched content never equals mastery; LeetCode count never equals
   pattern mastery.
4. Applications start week 1 and never move to the end.
5. Repeated attempts never inflate the 88-problem metric.
6. Adapt by evidence: no screens means fix targeting/resume; failed
   coding screens mean more practice; a scheduled interview always
   permits temporary reprioritization. The goal is the offer.
7. Curriculum revisions must preserve existing user progress: rename or
   re-parent rows in place (see `syncCurriculum` in `lib/seed-user.ts`),
   never wipe and reseed. Retired problems become extra practice
   (`inCurriculum: false`), never deletions.
