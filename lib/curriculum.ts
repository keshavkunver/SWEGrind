// The initial 8-week curriculum. Seeded per user on first sign-in
// (see lib/seed-user.ts). Editable afterwards in the app; this file is
// only the starting template.

// The 22 canonical SWE Grind patterns, in learning order. Secondary
// patterns (cyclic sort, two heaps, k-way merge, bitwise XOR) are
// deliberately excluded so they never dilute the core roadmap.
export const PATTERNS = [
  "Hash Maps / Sets",
  "Two Pointers",
  "Sliding Window",
  "Fast & Slow Pointers",
  "Stack",
  "Monotonic Stack",
  "Modified Binary Search",
  "In-place Linked List Reversal",
  "Merge Intervals",
  "Top-K / Heap",
  "Tree DFS",
  "Tree BFS / Level Order",
  "Graph BFS / DFS",
  "Matrix / Islands",
  "Topological Sort",
  "Union Find",
  "Subsets",
  "Backtracking",
  "Trie",
  "Greedy",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
];

export const SD_TOPICS = [
  "Requirements gathering",
  "API design",
  "HTTP / networking",
  "Data modeling",
  "SQL vs NoSQL",
  "Indexes",
  "Caching",
  "Load balancing",
  "Queues / workers",
  "Object storage",
  "Rate limiting",
  "Replication",
  "Partitioning",
  "Reliability",
  "Observability",
];

export const MILESTONES = [
  "Product definition",
  "React/TypeScript UI",
  "Next.js application",
  "PostgreSQL / data modeling",
  "Authentication",
  "APIs",
  "Structured LLM output",
  "Tool calling",
  "Retrieval / RAG",
  "Context / memory",
  "MCP",
  "Agent workflows",
  "Evals",
  "Reliability / observability",
  "Docker",
  "CI/CD",
  "Kubernetes fundamentals",
  "Production polish / deployment",
];

// title, url, type, topic, description
export const RESOURCES: [string, string, string, string, string][] = [
  ["React docs", "https://react.dev/learn", "docs", "React", "Official React learning path"],
  ["TypeScript docs", "https://www.typescriptlang.org/docs/handbook/intro.html", "docs", "TypeScript", "The TypeScript Handbook"],
  ["Next.js Learn", "https://nextjs.org/learn", "course", "Next.js", "Official interactive Next.js course"],
  ["PostgreSQL docs", "https://www.postgresql.org/docs/current/tutorial.html", "docs", "Databases", "Official PostgreSQL tutorial"],
  ["Missing Semester", "https://missing.csail.mit.edu/", "course", "Tooling", "MIT's course on shell, git, and dev tooling"],
  ["Hello Interview", "https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction", "practice", "System Design", "System Design in a Hurry: the primary system design spine"],
  ["NeetCode", "https://neetcode.io/roadmap", "practice", "Interview Prep", "The primary problem bank. Practice patterns here after learning them, not before"],
  ["Grokking the Coding Interview", "https://www.designgurus.io/course/grokking-the-coding-interview", "course", "Interview Prep", "The pattern teacher. Use relevant pattern lessons selectively, not end to end"],
  ["Coding Interview University", "https://github.com/jwasham/coding-interview-university", "docs", "Interview Prep", "Supplemental CS and data structure reference. Dip in when a concept is shaky; never attempt completion"],
  ["UMPIRE interview strategy", "https://guides.codepath.org/compsci/UMPIRE-Interview-Strategy", "docs", "Interview Prep", "CodePath's guide to the UMPIRE technical interview method"],
  ["MDN JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "docs", "JavaScript", "The JavaScript reference for closing diagnostic gaps"],
  ["Docker Get Started", "https://docs.docker.com/get-started/", "docs", "Tooling", "Official Docker introduction: images, containers, Compose"],
  ["Kubernetes Basics", "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "docs", "Tooling", "Official Kubernetes tutorial. Conceptual fluency only, not a DevOps specialization"],
  ["MCP docs", "https://modelcontextprotocol.io/", "docs", "AI Engineering", "Official Model Context Protocol documentation"],
  ["Anthropic docs", "https://docs.anthropic.com/", "docs", "AI Engineering", "Claude API and Claude Code documentation"],
  ["Stanford CS329A", "https://cs329a.stanford.edu/", "course", "AI Engineering", "Advanced agent theory. Use selectively; completion is not a requirement"],
];

// Recognition signals per pattern: curriculum content shown read-only on
// the pattern page ("when to reach for this").
export const PATTERN_SIGNALS: Record<string, string> = {
  "Hash Maps / Sets":
    "\"Seen before?\" means hash set. Frequency or counts means hash map. Value plus complement lookup (\"pair that sums to…\"), grouping by a computed key, O(1) membership, de-duplication.",
  "Two Pointers":
    "Sorted sequence, or comparing elements from both ends. \"Pair with target sum in sorted array\", palindromes, in-place partitioning, converging from both sides.",
  "Sliding Window":
    "Contiguous range with a constraint. \"Longest/shortest substring or subarray such that…\", running sums or counts over a moving range, at-most-K distinct.",
  "Fast & Slow Pointers":
    "Cycle in a linked structure, or the middle of one, without extra space. Two pointers at different speeds meet inside a cycle; the fast one reaching the end locates the midpoint.",
  Stack:
    "Matching, nesting, or a dependency on the most recent unresolved state. Balanced brackets, expression evaluation, undo behavior, collapsing adjacent items.",
  "Monotonic Stack":
    "\"Next greater\" or \"next smaller\" element for each position. Keep the stack sorted by popping everything your new element beats; whatever pops found its answer.",
  "Modified Binary Search":
    "Sorted search space, even a conceptual one. \"Minimum value that satisfies…\", rotated sorted arrays, guess-and-check over a numeric answer range with a monotonic yes/no test.",
  "In-place Linked List Reversal":
    "Reverse all or part of a linked list without extra space. Track prev/current/next carefully; sub-list reversal and k-group reversal build on the same three-pointer core.",
  "Merge Intervals":
    "Overlapping ranges, bookings, or schedules. Sort by start, then sweep: merge when the next start falls inside the current end, count collisions, or drop overlaps.",
  "Top-K / Heap":
    "Top K, smallest K, or K closest of anything, or repeatedly needing the min/max of a changing set. A heap of size K beats sorting everything; running medians want two heaps.",
  "Tree DFS":
    "Hierarchy or recursive structure processed per-subtree. Depth/height, path sums, ancestors, BST ordering invariants, recursion that combines child results.",
  "Tree BFS / Level Order":
    "Level-by-level traversal: values by depth, views from a side, zigzag order, or the nearest/shallowest node satisfying a condition. A queue processes one level at a time.",
  "Graph BFS / DFS":
    "Connectivity, reachability, or traversal over explicit nodes and edges. Connected components, shortest path in an unweighted graph (BFS), transformation chains as implicit graphs.",
  "Matrix / Islands":
    "Grid of cells where neighbors connect. \"Number of islands/regions\", flood fill, spreading processes (BFS from many sources), reachability from grid edges.",
  "Topological Sort":
    "Dependency ordering: prerequisites, build orders, \"can these all be finished?\". Kahn's algorithm (in-degrees plus a queue) or DFS with cycle detection.",
  "Union Find":
    "Dynamic connectivity and components while edges keep arriving. \"Are these two connected?\", redundant edges, merging groups that share a member.",
  Subsets:
    "Enumerate all subsets, combinations, or permutations. The decision tree of include/exclude choices; watch for duplicate handling on sorted input.",
  Backtracking:
    "Constrained search: build a partial solution, recurse, undo. Board placement, path finding with constraints, partitioning; prune branches that cannot succeed.",
  Trie:
    "Prefix search over many words. Autocomplete, word dictionaries with wildcards, \"does any word start with…\"; one tree walk replaces scanning the whole word list.",
  Greedy:
    "A local optimal decision with a provable global property. Interval scheduling, jumps and reachability, fuel/gas feasibility; if a sort plus one pass works, suspect greedy.",
  "1-D Dynamic Programming":
    "Optimal value or count of ways along a sequence with overlapping subproblems. \"Max/min cost to reach the end\", \"how many ways…\", choices depending on earlier positions.",
  "2-D Dynamic Programming":
    "Two sequences compared, a grid of states, or take/skip with a capacity. Edit distance and LCS tables, path counting on grids, knapsack-style partitioning.",
};

// System design topic content: links, practice prompts, and recall
// questions, shown read-only on the topic page.
export const SD_TOPIC_CONTENT: Record<
  string,
  { links: { label: string; url: string }[]; practice: string; recall: string }
> = {
  "Requirements gathering": {
    links: [{ label: "Hello Interview: Delivery framework", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery" }],
    practice: "Take any app you use daily and write its functional and non-functional requirements in 5 minutes.",
    recall: "What is the difference between functional and non-functional requirements?\nName four common non-functional requirements and how you would quantify each.",
  },
  "API design": {
    links: [{ label: "Hello Interview: API design", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/core-concepts" }],
    practice: "Design the REST API for a URL shortener: endpoints, methods, request/response bodies, status codes.",
    recall: "When would you choose POST vs PUT vs PATCH?\nWhat belongs in the path vs query string vs body?\nHow do you version an API without breaking clients?",
  },
  "HTTP / networking": {
    links: [{ label: "MDN: HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" }],
    practice: "Trace what happens end to end when you type a URL and press Enter: DNS, TCP, TLS, HTTP, render.",
    recall: "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?\nWhat does a TLS handshake establish?\nWhat are common status code classes and examples of each?",
  },
  "Data modeling": {
    links: [{ label: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }],
    practice: "Model the schema for a Twitter clone: users, tweets, follows, likes. Identify keys, indexes, and the hardest query.",
    recall: "How do you model many-to-many relationships?\nWhat is normalization, and when do you deliberately denormalize?",
  },
  "SQL vs NoSQL": {
    links: [{ label: "Hello Interview: Database choices", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/key-technologies" }],
    practice: "For each: chat messages, product catalog, bank ledger, session store. Pick a database type and defend it.",
    recall: "What guarantees do ACID transactions give?\nWhen does a document store beat a relational database, and vice versa?",
  },
  Indexes: {
    links: [{ label: "Use the Index, Luke", url: "https://use-the-index-luke.com/" }],
    practice: "Given a slow query with WHERE user_id = ? AND created_at > ? ORDER BY created_at, design the right index and explain why.",
    recall: "How does a B-tree index work at a high level?\nWhy not index every column?\nWhat is a covering index?",
  },
  Caching: {
    links: [{ label: "Hello Interview: Caching", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/key-technologies" }],
    practice: "Add caching to a product page serving 10k rps: what do you cache, where, with what TTL and invalidation strategy?",
    recall: "Compare cache-aside, write-through, and write-behind.\nWhat is cache stampede and two ways to prevent it?\nWhy is invalidation hard?",
  },
  "Load balancing": {
    links: [{ label: "Cloudflare: What is load balancing?", url: "https://www.cloudflare.com/learning/performance/what-is-load-balancing/" }],
    practice: "Sketch L4 vs L7 load balancing for a web app with websockets. Where does TLS terminate?",
    recall: "Name three load-balancing algorithms and when each fits.\nHow do health checks and connection draining work?",
  },
  "Queues / workers": {
    links: [{ label: "AWS: What is a message queue?", url: "https://aws.amazon.com/message-queue/" }],
    practice: "Design image-upload processing (resize, scan, thumbnail) with a queue: what is the message, retry policy, and failure path?",
    recall: "At-least-once vs at-most-once vs exactly-once: what does each require?\nWhat is a dead-letter queue?\nWhy must consumers be idempotent?",
  },
  "Object storage": {
    links: [{ label: "AWS S3 documentation", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" }],
    practice: "Design file uploads for a web app using presigned URLs: draw the request flow and explain why uploads skip your server.",
    recall: "Why store files in object storage instead of the database?\nWhat is a presigned URL and what does it protect?",
  },
  "Rate limiting": {
    links: [{ label: "Hello Interview: Rate limiting", url: "https://www.hellointerview.com/learn/system-design/problem-breakdowns/rate-limiter" }],
    practice: "Design a rate limiter for a public API: algorithm, storage, response headers, and behavior across multiple servers.",
    recall: "Compare token bucket and sliding window.\nWhere should limits be enforced, and keyed by what?\nWhat should a 429 response include?",
  },
  Replication: {
    links: [{ label: "PostgreSQL: Replication", url: "https://www.postgresql.org/docs/current/high-availability.html" }],
    practice: "Add read replicas to a saturated primary: which queries move, and what breaks when replication lags?",
    recall: "Sync vs async replication tradeoffs?\nWhat is read-your-own-writes consistency and how do you get it with replicas?",
  },
  Partitioning: {
    links: [{ label: "Hello Interview: Sharding", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/core-concepts" }],
    practice: "Shard a users table at 10x growth: pick a shard key, explain resharding, and identify queries that get harder.",
    recall: "Range vs hash partitioning tradeoffs?\nWhat makes a good shard key?\nWhat is a hot partition?",
  },
  Reliability: {
    links: [{ label: "Google SRE book (free)", url: "https://sre.google/sre-book/table-of-contents/" }],
    practice: "Your checkout service calls a flaky payment API. Add timeouts, retries with backoff, and a circuit breaker; explain each choice.",
    recall: "Why do retries need jitter and budgets?\nWhat is a circuit breaker and its three states?\nDefine SLI, SLO, SLA.",
  },
  Observability: {
    links: [{ label: "Grafana: The three pillars", url: "https://grafana.com/docs/grafana/latest/fundamentals/" }],
    practice: "Instrument a checkout flow: which metrics, logs, and traces would let you find a p99 latency regression in minutes?",
    recall: "Logs vs metrics vs traces: what question does each answer?\nWhat are the four golden signals?\nWhy percentiles instead of averages?",
  },
};

// The 88 canonical curriculum problems: 22 patterns x 4 purposeful slots.
// [name, leetcode slug, difficulty, role]
// Roles progressively remove scaffolding:
//   guided      (A) you know the pattern; a walkthrough is allowed
//   supported   (B) you know the pattern; derive the algorithm yourself
//   independent (C) tougher or less obvious; minimal assistance
//   transfer    (D) identify how the pattern applies on your own
export type SeedProblem = [
  string,
  string,
  "easy" | "medium" | "hard",
  "guided" | "supported" | "independent" | "transfer",
];

export const PATTERN_PROBLEMS: Record<string, SeedProblem[]> = {
  "Hash Maps / Sets": [
    ["Contains Duplicate", "contains-duplicate", "easy", "guided"],
    ["Valid Anagram", "valid-anagram", "easy", "supported"],
    ["Two Sum", "two-sum", "easy", "independent"],
    ["Group Anagrams", "group-anagrams", "medium", "transfer"],
  ],
  "Two Pointers": [
    ["Valid Palindrome", "valid-palindrome", "easy", "guided"],
    ["Two Sum II", "two-sum-ii-input-array-is-sorted", "medium", "supported"],
    ["3Sum", "3sum", "medium", "independent"],
    ["Container With Most Water", "container-with-most-water", "medium", "transfer"],
  ],
  "Sliding Window": [
    ["Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "easy", "guided"],
    ["Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "medium", "supported"],
    ["Longest Repeating Character Replacement", "longest-repeating-character-replacement", "medium", "independent"],
    ["Minimum Window Substring", "minimum-window-substring", "hard", "transfer"],
  ],
  "Fast & Slow Pointers": [
    ["Linked List Cycle", "linked-list-cycle", "easy", "guided"],
    ["Middle of the Linked List", "middle-of-the-linked-list", "easy", "supported"],
    ["Linked List Cycle II", "linked-list-cycle-ii", "medium", "independent"],
    ["Find the Duplicate Number", "find-the-duplicate-number", "medium", "transfer"],
  ],
  Stack: [
    ["Valid Parentheses", "valid-parentheses", "easy", "guided"],
    ["Min Stack", "min-stack", "medium", "supported"],
    ["Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "medium", "independent"],
    ["Asteroid Collision", "asteroid-collision", "medium", "transfer"],
  ],
  "Monotonic Stack": [
    ["Next Greater Element I", "next-greater-element-i", "easy", "guided"],
    ["Daily Temperatures", "daily-temperatures", "medium", "supported"],
    ["Car Fleet", "car-fleet", "medium", "independent"],
    ["Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "hard", "transfer"],
  ],
  "Modified Binary Search": [
    ["Binary Search", "binary-search", "easy", "guided"],
    ["Search a 2D Matrix", "search-a-2d-matrix", "medium", "supported"],
    ["Koko Eating Bananas", "koko-eating-bananas", "medium", "independent"],
    ["Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "medium", "transfer"],
  ],
  "In-place Linked List Reversal": [
    ["Reverse Linked List", "reverse-linked-list", "easy", "guided"],
    ["Reverse Linked List II", "reverse-linked-list-ii", "medium", "supported"],
    ["Reorder List", "reorder-list", "medium", "independent"],
    ["Reverse Nodes in k-Group", "reverse-nodes-in-k-group", "hard", "transfer"],
  ],
  "Merge Intervals": [
    ["Merge Intervals", "merge-intervals", "medium", "guided"],
    ["Insert Interval", "insert-interval", "medium", "supported"],
    ["Non-overlapping Intervals", "non-overlapping-intervals", "medium", "independent"],
    ["Minimum Number of Arrows to Burst Balloons", "minimum-number-of-arrows-to-burst-balloons", "medium", "transfer"],
  ],
  "Top-K / Heap": [
    ["Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "easy", "guided"],
    ["Last Stone Weight", "last-stone-weight", "easy", "supported"],
    ["K Closest Points to Origin", "k-closest-points-to-origin", "medium", "independent"],
    ["Top K Frequent Elements", "top-k-frequent-elements", "medium", "transfer"],
  ],
  "Tree DFS": [
    ["Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "easy", "guided"],
    ["Invert Binary Tree", "invert-binary-tree", "easy", "supported"],
    ["Diameter of Binary Tree", "diameter-of-binary-tree", "easy", "independent"],
    ["Validate Binary Search Tree", "validate-binary-search-tree", "medium", "transfer"],
  ],
  "Tree BFS / Level Order": [
    ["Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "medium", "guided"],
    ["Average of Levels in Binary Tree", "average-of-levels-in-binary-tree", "easy", "supported"],
    ["Binary Tree Right Side View", "binary-tree-right-side-view", "medium", "independent"],
    ["Binary Tree Zigzag Level Order Traversal", "binary-tree-zigzag-level-order-traversal", "medium", "transfer"],
  ],
  "Graph BFS / DFS": [
    ["Clone Graph", "clone-graph", "medium", "guided"],
    ["Number of Provinces", "number-of-provinces", "medium", "supported"],
    ["Surrounded Regions", "surrounded-regions", "medium", "independent"],
    ["Word Ladder", "word-ladder", "hard", "transfer"],
  ],
  "Matrix / Islands": [
    ["Number of Islands", "number-of-islands", "medium", "guided"],
    ["Max Area of Island", "max-area-of-island", "medium", "supported"],
    ["Rotting Oranges", "rotting-oranges", "medium", "independent"],
    ["Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "medium", "transfer"],
  ],
  "Topological Sort": [
    ["Course Schedule", "course-schedule", "medium", "guided"],
    ["Course Schedule II", "course-schedule-ii", "medium", "supported"],
    ["Find Eventual Safe States", "find-eventual-safe-states", "medium", "independent"],
    ["Minimum Height Trees", "minimum-height-trees", "medium", "transfer"],
  ],
  "Union Find": [
    ["Find if Path Exists in Graph", "find-if-path-exists-in-graph", "easy", "guided"],
    ["Redundant Connection", "redundant-connection", "medium", "supported"],
    ["Accounts Merge", "accounts-merge", "medium", "independent"],
    ["Most Stones Removed with Same Row or Column", "most-stones-removed-with-same-row-or-column", "medium", "transfer"],
  ],
  Subsets: [
    ["Subsets", "subsets", "medium", "guided"],
    ["Subsets II", "subsets-ii", "medium", "supported"],
    ["Permutations", "permutations", "medium", "independent"],
    ["Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "medium", "transfer"],
  ],
  Backtracking: [
    ["Combination Sum", "combination-sum", "medium", "guided"],
    ["Word Search", "word-search", "medium", "supported"],
    ["Palindrome Partitioning", "palindrome-partitioning", "medium", "independent"],
    ["N-Queens", "n-queens", "hard", "transfer"],
  ],
  Trie: [
    ["Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "medium", "guided"],
    ["Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "medium", "supported"],
    ["Replace Words", "replace-words", "medium", "independent"],
    ["Word Search II", "word-search-ii", "hard", "transfer"],
  ],
  Greedy: [
    ["Maximum Subarray", "maximum-subarray", "medium", "guided"],
    ["Jump Game", "jump-game", "medium", "supported"],
    ["Jump Game II", "jump-game-ii", "medium", "independent"],
    ["Gas Station", "gas-station", "medium", "transfer"],
  ],
  "1-D Dynamic Programming": [
    ["Climbing Stairs", "climbing-stairs", "easy", "guided"],
    ["House Robber", "house-robber", "medium", "supported"],
    ["Coin Change", "coin-change", "medium", "independent"],
    ["Longest Increasing Subsequence", "longest-increasing-subsequence", "medium", "transfer"],
  ],
  "2-D Dynamic Programming": [
    ["Unique Paths", "unique-paths", "medium", "guided"],
    ["Longest Common Subsequence", "longest-common-subsequence", "medium", "supported"],
    ["Partition Equal Subset Sum", "partition-equal-subset-sum", "medium", "independent"],
    ["Edit Distance", "edit-distance", "medium", "transfer"],
  ],
};

// The UMPIRE technical interview method (CodePath): the standard way to
// work every coding problem, spoken aloud in later-week timed practice.
export const UMPIRE_STEPS: { letter: string; name: string; detail: string }[] = [
  { letter: "U", name: "Understand", detail: "Clarify inputs, outputs, constraints, assumptions, and edge cases before anything else." },
  { letter: "M", name: "Match", detail: "Map the problem to known patterns, data structures, and algorithms. This is where the 22 patterns earn their keep." },
  { letter: "P", name: "Plan", detail: "Explain the approach, data structures, and pseudocode before writing real code." },
  { letter: "I", name: "Implement", detail: "Write clean code. Python for coding interviews unless a target interview requires another language." },
  { letter: "R", name: "Review", detail: "Walk through an example input, the edge cases, and likely bugs." },
  { letter: "E", name: "Evaluate", detail: "State time and space complexity, tradeoffs, and possible alternatives." },
];

// STAR + Learning: the behavioral interview method. Separate from UMPIRE.
export const STAR_STEPS: { name: string; detail: string }[] = [
  { name: "Situation", detail: "Give the relevant context, briefly." },
  { name: "Task", detail: "Explain your responsibility or the problem." },
  { name: "Action", detail: "Explain specifically what YOU did." },
  { name: "Result", detail: "Give the measurable or meaningful outcome." },
  { name: "Learning", detail: "What you learned, what you would repeat or change, and how it shaped later decisions." },
];

// Build one reusable story for each of these before interviews start.
export const STAR_STORY_PROMPTS = [
  "A difficult technical problem",
  "A disagreement or conflict",
  "Ownership beyond your role",
  "A failure or mistake",
  "Working through ambiguity",
  "Leadership or initiative",
  "Meaningful impact",
  "A tight deadline",
  "A technical tradeoff",
  "Cross-functional collaboration",
];

export type SeedTask = {
  day: number;
  title: string;
  category: string;
  estMinutes?: number;
  description?: string;
  links?: { label: string; url: string }[];
};

const neetcode = { label: "NeetCode", url: "https://neetcode.io/roadmap" };

const grokking = {
  label: "Grokking",
  url: "https://www.designgurus.io/course/grokking-the-coding-interview",
};
const umpireGuide = {
  label: "UMPIRE guide",
  url: "https://guides.codepath.org/compsci/UMPIRE-Interview-Strategy",
};

// Shared engineering / system design resources referenced by several tasks.
// Every URL here was verified live before being added; keep it that way
// when editing (curl each new link).
const helloCore = {
  label: "Hello Interview: Core concepts",
  url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/core-concepts",
};
const helloPractice = {
  label: "Hello Interview: Practice",
  url: "https://www.hellointerview.com/practice",
};
const awsQueues = {
  label: "AWS: What is a message queue?",
  url: "https://aws.amazon.com/message-queue/",
};
const awsRetries = {
  label: "AWS: Retries and backoff with jitter",
  url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
};
const effectiveAgents = {
  label: "Anthropic: Building Effective Agents",
  url: "https://www.anthropic.com/research/building-effective-agents",
};
const hamelEvals = {
  label: "Hamel: Your AI product needs evals",
  url: "https://hamel.dev/blog/posts/evals/",
};

// Pattern-study sessions follow the core loop: understand the data
// structure, learn the pattern and its recognition signals from a
// pattern-oriented lesson (Grokking's role: pattern teacher), trace a
// worked example, then move through the four problem slots on the pattern
// page (NeetCode's role: problem bank). Never open problems before the
// pattern makes sense.
const patternStudy = (day: number, title: string, estMinutes = 90): SeedTask => ({
  day,
  title,
  category: "InterviewPrep",
  estMinutes,
  description:
    "Spend the first 30 minutes learning the pattern in Grokking: why it works, its recognition signals, the implementation template. Then open this pattern's page here and work the four problem slots in order; carry unfinished slots through the week.",
  links: [grokking, neetcode],
});

export const WEEK_TASKS: Record<number, SeedTask[]> = {
  1: [
    patternStudy(1, "Hash maps / sets pattern"),
    { day: 1, title: "JavaScript diagnostic", category: "Engineering", estMinutes: 60, description: "Spend 40 minutes working the MDN skill tests cold, in order, and write down every exercise you cannot finish. Spend the last 20 minutes on your weakest topic in javascript.info; keep the miss list and clear it during the week.", links: [{ label: "MDN: Test your skills (the diagnostic)", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Test_your_skills" }, { label: "javascript.info (fill the gaps)", url: "https://javascript.info" }] },
    { day: 2, title: "Two pointers pattern", category: "InterviewPrep", estMinutes: 90, description: "Spend the first 30 minutes learning the pattern in Grokking: why it works, its recognition signals, the implementation template. Then open this pattern's page here and work the four problem slots in order; carry unfinished slots through the week.", links: [grokking, neetcode] },
    { day: 2, title: "React fundamentals", category: "Engineering", estMinutes: 120, description: "Pick one path and finish it: either work react.dev Learn from Describing the UI through Adding Interactivity, doing every challenge, or code along with the React 19 course video (2 hr). Same ground either way; do not do both today.", links: [{ label: "react.dev Learn (do the challenges)", url: "https://react.dev/learn" }, { label: "React 19 Course (video, 2 hr)", url: "https://www.youtube.com/watch?v=dCLhUialKPQ" }] },
    { day: 3, title: "The UMPIRE method", category: "InterviewPrep", estMinutes: 45, description: "Read the guide once, then write the six steps from memory: Understand, Match, Plan, Implement, Review, Evaluate. Run them end to end on one easy problem you have already solved. Keep the steps next to you for every problem from now on.", links: [umpireGuide] },
    { day: 3, title: "TypeScript fundamentals", category: "Engineering", estMinutes: 120, description: "Work the Beginner's TypeScript exercises in order, attempting each one before revealing the solution. When a compiler error stumps you, look it up in the handbook before moving on.", links: [{ label: "Beginner's TypeScript (interactive)", url: "https://www.totaltypescript.com/tutorials/beginners-typescript" }, { label: "TS Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }] },
    { day: 4, title: "Claude Code workflow", category: "AIEngineering", estMinutes: 90, description: "Run one full loop on a small repo: explore the code, plan a change, implement it, test it, review the diff. Make it explain anything you could not have written yourself; it tutors, it does not replace understanding.", links: [{ label: "Claude Code docs", url: "https://docs.anthropic.com/en/docs/claude-code" }] },
    { day: 5, title: "Begin the sliding window pattern", category: "InterviewPrep", estMinutes: 60, description: "Read Grokking's sliding window intro and trace two worked examples on paper, writing the window bounds at each step. Full study session next week.", links: [grokking] },
    { day: 5, title: "System design interview framework", category: "SystemDesign", estMinutes: 90, description: "Read the framework end to end, then write its steps from memory: requirements, core entities, API, data flow, high-level design, deep dives. Repeat until you can produce the list cold; it runs every design session from here.", links: [{ label: "Hello Interview", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction" }] },
    { day: 6, title: "Begin targeted job applications", category: "Career", estMinutes: 60, description: "Resume, LinkedIn, GitHub, application tracker, real reference jobs. Target 5 to 8 tailored applications this week; applications start now, not in week 8." },
  ],
  2: [
    patternStudy(1, "Sliding window pattern"),
    { day: 1, title: "React depth", category: "Engineering", estMinutes: 120, description: "Hooks in depth, state patterns, composition. Work the two react.dev sections in order; do the challenges, not just the reading.", links: [{ label: "react.dev: Managing State", url: "https://react.dev/learn/managing-state" }, { label: "react.dev: Escape Hatches", url: "https://react.dev/learn/escape-hatches" }] },
    patternStudy(2, "Fast and slow pointers pattern"),
    { day: 2, title: "Next.js fundamentals", category: "Engineering", estMinutes: 120, links: [{ label: "Next.js Learn", url: "https://nextjs.org/learn" }] },
    patternStudy(3, "Stack pattern"),
    patternStudy(4, "Monotonic stack pattern"),
    { day: 4, title: "LLM API fundamentals", category: "AIEngineering", estMinutes: 90, links: [{ label: "Anthropic docs", url: "https://docs.anthropic.com/" }] },
    patternStudy(5, "Modified binary search pattern"),
    { day: 5, title: "Structured outputs", category: "AIEngineering", estMinutes: 90, description: "Get the model returning validated JSON reliably: schemas, tool-shaped outputs, handling refusals and malformed output.", links: [{ label: "Anthropic: Structured outputs", url: "https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs" }] },
    { day: 6, title: "Networking / API fundamentals", category: "SystemDesign", estMinutes: 90, links: [{ label: "MDN: HTTP overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" }, helloCore] },
  ],
  3: [
    patternStudy(1, "In-place linked list reversal pattern"),
    { day: 1, title: "PostgreSQL setup and basics", category: "Engineering", estMinutes: 90, description: "Get a database running locally and talk to it from code. The Prisma quickstart mirrors the Life Companion stack.", links: [{ label: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }, { label: "Prisma + Postgres quickstart", url: "https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql" }] },
    patternStudy(2, "Merge intervals pattern"),
    { day: 2, title: "SQL practice", category: "Engineering", estMinutes: 90, description: "Interactive drills, no setup: SQLBolt for the core, then PostgreSQL Exercises until joins and aggregates feel automatic.", links: [{ label: "SQLBolt (interactive)", url: "https://sqlbolt.com" }, { label: "PostgreSQL Exercises", url: "https://pgexercises.com" }] },
    patternStudy(3, "Tree DFS pattern"),
    { day: 3, title: "Data modeling", category: "Engineering", estMinutes: 90, description: "Tables, relations, constraints, normalization enough to be dangerous. Sketch the Life Companion schema as the exercise.", links: [{ label: "Prisma: Data modeling", url: "https://www.prisma.io/docs/orm/prisma-schema/data-model/models" }, { label: "Prisma Data Guide", url: "https://www.prisma.io/dataguide" }] },
    patternStudy(4, "Tree BFS pattern"),
    { day: 4, title: "Authentication", category: "Engineering", estMinutes: 120, description: "Sessions vs tokens, password handling, OAuth shape. The Copenhagen Book is the concepts; Supabase Auth is the implementation you will actually use.", links: [{ label: "The Copenhagen Book", url: "https://thecopenhagenbook.com" }, { label: "Supabase Auth docs", url: "https://supabase.com/docs/guides/auth" }] },
    { day: 5, title: "API design and building", category: "Engineering", estMinutes: 90, description: "Design first (resources, verbs, status codes, errors), then build a couple of real endpoints with Next.js route handlers.", links: [helloCore, { label: "Next.js: Route Handlers", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers" }] },
    { day: 5, title: "Life Companion: full-stack foundation", category: "Project", estMinutes: 180 },
    { day: 5, title: "Begin the STAR story bank", category: "Career", estMinutes: 45, description: "Draft STAR + Learning stories: a hard technical problem, a conflict, ownership, a failure. Keep adding one story per week from here." },
    { day: 6, title: "Life Companion: basic AI integration", category: "Project", estMinutes: 120 },
  ],
  4: [
    patternStudy(1, "Top-K / heap pattern"),
    { day: 2, title: "Testing", category: "Engineering", estMinutes: 120, description: "Vitest for units, Testing Library for components. Write real tests against Life Companion code, not toy examples.", links: [{ label: "Vitest guide", url: "https://vitest.dev/guide/" }, { label: "Testing Library: queries", url: "https://testing-library.com/docs/queries/about/" }] },
    patternStudy(2, "Graph BFS / DFS pattern"),
    { day: 3, title: "CI/CD", category: "Engineering", estMinutes: 90, description: "Follow the quickstart, then wire a real workflow on Life Companion: lint + tests on every push.", links: [{ label: "GitHub Actions quickstart", url: "https://docs.github.com/en/actions/quickstart" }] },
    patternStudy(3, "Matrix / islands pattern"),
    { day: 4, title: "Docker", category: "Engineering", estMinutes: 120, description: "Dockerfile, image vs container, ports, env vars, volumes, Compose. Target: use it independently on Life Companion.", links: [{ label: "Docker Get Started", url: "https://docs.docker.com/get-started/" }] },
    { day: 5, title: "Tool calling", category: "AIEngineering", estMinutes: 90, description: "Define tools, let the model call them, handle results and errors. Build one working tool loop end to end.", links: [{ label: "Anthropic: Tool use", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" }] },
    { day: 5, title: "Prompt and workflow design", category: "AIEngineering", estMinutes: 90, description: "Deterministic workflows and prompt chains before agents: application code controls the sequence unless the model genuinely needs to.", links: [effectiveAgents, { label: "Anthropic: Prompt engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" }] },
    { day: 6, title: "Life Companion: full-stack V1 deployment", category: "Project", estMinutes: 180 },
  ],
  5: [
    patternStudy(1, "Topological sort pattern"),
    patternStudy(2, "Union find pattern"),
    patternStudy(3, "Subsets pattern"),
    { day: 3, title: "Retrieval", category: "AIEngineering", estMinutes: 90, description: "Embeddings, vector search, similarity. Supabase pgvector is the stack Life Companion will use.", links: [{ label: "Pinecone: What is a vector DB", url: "https://www.pinecone.io/learn/vector-database/" }, { label: "Supabase: AI & Vectors", url: "https://supabase.com/docs/guides/ai" }] },
    patternStudy(4, "Backtracking pattern"),
    { day: 4, title: "RAG", category: "AIEngineering", estMinutes: 120, description: "Chunking, retrieval, grounding, citations, and where naive RAG falls over.", links: [{ label: "Pinecone: RAG explained", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/" }, { label: "Anthropic: Contextual retrieval", url: "https://www.anthropic.com/news/contextual-retrieval" }] },
    { day: 5, title: "Mixed problems: identify the pattern yourself", category: "InterviewPrep", estMinutes: 60, description: "Unlabeled problems from earlier patterns. Use UMPIRE's Match step to identify the pattern before solving." },
    { day: 5, title: "Context engineering", category: "AIEngineering", estMinutes: 90, description: "What goes in the window and why: system prompts, retrieved context, history compaction, token budgets.", links: [{ label: "Anthropic: Context engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" }] },
    { day: 5, title: "Life Companion: calendar / tool integration", category: "Project", estMinutes: 150 },
    { day: 6, title: "Async and background jobs", category: "Engineering", estMinutes: 90, description: "Why work leaves the request cycle: queues, workers, retries, idempotency. Inngest is the serverless-friendly implementation path.", links: [awsQueues, { label: "Inngest docs", url: "https://www.inngest.com/docs" }] },
    { day: 6, title: "Scaling concepts", category: "SystemDesign", estMinutes: 90, description: "The classic lecture still holds up: vertical vs horizontal, load balancing, caching, replication.", links: [{ label: "Harvard CS75: Scalability (video)", url: "https://www.youtube.com/watch?v=-W9F__D3oY4" }, helloCore] },
  ],
  6: [
    patternStudy(1, "Trie pattern"),
    patternStudy(2, "Greedy pattern"),
    { day: 3, title: "1-D dynamic programming pattern", category: "InterviewPrep", estMinutes: 120, description: "Learn the pattern before the problems: why it works, recognition signals, the implementation template. Then work the pattern page's four problem slots in order.", links: [grokking, neetcode] },
    { day: 3, title: "MCP", category: "AIEngineering", estMinutes: 90, links: [{ label: "MCP docs", url: "https://modelcontextprotocol.io/" }] },
    { day: 4, title: "Begin 2-D dynamic programming", category: "InterviewPrep", estMinutes: 90, description: "Grid and two-sequence DP tables. Finishes next week.", links: [grokking] },
    { day: 4, title: "Agent workflows", category: "AIEngineering", estMinutes: 120, description: "Goal, choose action, tool, observe, decide, finish. Iteration limits, permissions, human approval, failure recovery.", links: [effectiveAgents] },
    { day: 5, title: "Python for AI engineering", category: "Engineering", estMinutes: 120, description: "Practical Python only: syntax differences, lists/dicts/sets, classes, async basics, SDK usage. Not a giant Python course.", links: [{ label: "Learn X in Y minutes: Python", url: "https://learnxinyminutes.com/docs/python/" }, { label: "Official Python tutorial", url: "https://docs.python.org/3/tutorial/" }] },
    { day: 6, title: "Reliability", category: "Engineering", estMinutes: 90, description: "Timeouts, retries with backoff and jitter, idempotency keys, graceful degradation. The AWS article is the core reading.", links: [awsRetries, { label: "Google SRE book", url: "https://sre.google/sre-book/table-of-contents/" }] },
    { day: 6, title: "Queues, workers, and storage", category: "SystemDesign", estMinutes: 90, links: [{ label: "Hello Interview: Key technologies", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/key-technologies" }, awsQueues] },
  ],
  7: [
    { day: 1, title: "Complete 2-D dynamic programming", category: "InterviewPrep", estMinutes: 120, description: "All 22 patterns have now been introduced. Do not sacrifice interview-quality practice to finish all 88 problems.", links: [grokking, neetcode] },
    { day: 1, title: "Mixed timed interview practice", category: "InterviewPrep", estMinutes: 120, description: "Timed mediums, unseen problems, no pattern labels. Follow UMPIRE aloud." },
    { day: 3, title: "Mixed timed interview practice", category: "InterviewPrep", estMinutes: 120, description: "Timed mediums, unseen problems, no pattern labels. Follow UMPIRE aloud." },
    { day: 2, title: "Evals", category: "AIEngineering", estMinutes: 120, description: "Build the Life Companion eval dataset: grounding, retrieval accuracy, tool selection, task success, tone, latency, cost.", links: [{ label: "Anthropic: Define success and tests", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests" }, hamelEvals] },
    { day: 4, title: "AI quality feedback loops", category: "AIEngineering", estMinutes: 90, description: "Turn eval results and production failures into fixes: error analysis, regression sets, the improve-measure loop.", links: [hamelEvals] },
    { day: 5, title: "Observability", category: "Engineering", estMinutes: 90, description: "Logs, metrics, traces, and what each is for. Wire real logging into Life Companion while it is fresh.", links: [{ label: "OpenTelemetry: Observability primer", url: "https://opentelemetry.io/docs/concepts/observability-primer/" }, { label: "Grafana fundamentals", url: "https://grafana.com/docs/grafana/latest/fundamentals/" }] },
    { day: 5, title: "Life Companion: UX polish", category: "Project", estMinutes: 120 },
    { day: 6, title: "System design practice interviews", category: "SystemDesign", estMinutes: 120, links: [helloPractice] },
  ],
  8: [
    { day: 1, title: "Coding mocks", category: "InterviewPrep", estMinutes: 120, description: "Unseen timed problems, weak-pattern review, spaced re-solves. Simulate the real thing: UMPIRE aloud, no assistance." },
    { day: 2, title: "System design mocks", category: "SystemDesign", estMinutes: 120, links: [helloPractice] },
    { day: 3, title: "Behavioral prep", category: "Career", estMinutes: 90, description: "Rehearse the STAR + Learning story bank out loud; one story per category, tightened to two minutes each." },
    { day: 3, title: "Verification and retries", category: "AIEngineering", estMinutes: 90, description: "Check model output before acting on it; retry with feedback when it fails. Same backoff discipline as any other unreliable dependency.", links: [effectiveAgents, awsRetries] },
    { day: 4, title: "AI safety and reliability", category: "AIEngineering", estMinutes: 90, description: "Prompt injection, data leakage, excessive agency: know the top risks and what mitigations exist.", links: [{ label: "OWASP LLM Top 10", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/" }] },
    { day: 4, title: "Latency and cost analysis", category: "AIEngineering", estMinutes: 60, description: "Price out Life Companion per user per day; find the two biggest token sinks and cut them with caching.", links: [{ label: "Anthropic: Pricing", url: "https://docs.anthropic.com/en/docs/about-claude/pricing" }, { label: "Anthropic: Prompt caching", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching" }] },
    { day: 5, title: "Docker / Kubernetes review", category: "Engineering", estMinutes: 90, description: "K8s conceptually only: cluster, node, pod, deployment, service, ingress, ConfigMap/Secret, replicas, health checks, autoscaling. One simple deployment if practical.", links: [{ label: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" }] },
    { day: 5, title: "Life Companion: deployment", category: "Project", estMinutes: 120, description: "Feature freeze. Polish, reliability, README, architecture diagram, demo, case study." },
    { day: 6, title: "Portfolio and case-study polish", category: "Career", estMinutes: 120 },
    { day: 7, title: "Heavy applications and interviewing", category: "Career", estMinutes: 120, description: "10 to 15+ targeted applications where sustainable. Interview prep outranks project feature development." },
  ],
};

// Track C (applications / networking / pipeline) runs every week, not just
// weeks 1 and 8. Cadence ramps: 5-8/week early, 8-12 mid, 10-15+ late.
const APPLICATION_TARGETS: Record<number, string> = {
  2: "5 to 8", 3: "8 to 12", 4: "8 to 12", 5: "10 to 15+", 6: "10 to 15+", 7: "10 to 15+",
};
for (let week = 2; week <= 7; week++) {
  WEEK_TASKS[week].push({
    day: 6,
    title: "Applications and networking",
    category: "Career",
    estMinutes: 60,
    description: `Send ${APPLICATION_TARGETS[week]} tailored applications; pursue referrals; keep resume/GitHub sharp. If an interview is scheduled, company-specific prep outranks the normal curriculum.`,
  });
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
