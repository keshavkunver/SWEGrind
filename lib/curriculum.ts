// The initial 8-week curriculum. Seeded per user on first sign-in
// (see lib/seed-user.ts). Editable afterwards in the app; this file is
// only the starting template.

export const PATTERNS = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked Lists",
  "Trees",
  "BFS / DFS",
  "Heaps",
  "Graphs",
  "Backtracking",
  "Dynamic Programming",
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
  ["Hello Interview", "https://www.hellointerview.com/", "practice", "System Design", "System design interview prep"],
  ["NeetCode", "https://neetcode.io/", "practice", "Interview Prep", "Pattern-based LeetCode roadmap"],
  ["Anthropic docs", "https://docs.anthropic.com/", "docs", "AI Engineering", "Claude API and Claude Code documentation"],
  ["Stanford CS329A", "https://cs329a.stanford.edu/", "course", "AI Engineering", "Self-improving AI agents course"],
];

// Curated starter problems per pattern (NeetCode-style progressions).
// [name, leetcode slug, difficulty, kind]
export type SeedProblem = [
  string,
  string,
  "easy" | "medium" | "hard",
  "guided" | "independent",
];

export const PATTERN_PROBLEMS: Record<string, SeedProblem[]> = {
  "Arrays & Hashing": [
    ["Two Sum", "two-sum", "easy", "guided"],
    ["Contains Duplicate", "contains-duplicate", "easy", "guided"],
    ["Valid Anagram", "valid-anagram", "easy", "independent"],
    ["Group Anagrams", "group-anagrams", "medium", "independent"],
    ["Top K Frequent Elements", "top-k-frequent-elements", "medium", "independent"],
    ["Product of Array Except Self", "product-of-array-except-self", "medium", "independent"],
  ],
  "Two Pointers": [
    ["Valid Palindrome", "valid-palindrome", "easy", "guided"],
    ["Two Sum II", "two-sum-ii-input-array-is-sorted", "medium", "guided"],
    ["3Sum", "3sum", "medium", "independent"],
    ["Container With Most Water", "container-with-most-water", "medium", "independent"],
    ["Trapping Rain Water", "trapping-rain-water", "hard", "independent"],
  ],
  "Sliding Window": [
    ["Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "easy", "guided"],
    ["Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "medium", "guided"],
    ["Longest Repeating Character Replacement", "longest-repeating-character-replacement", "medium", "independent"],
    ["Permutation in String", "permutation-in-string", "medium", "independent"],
    ["Minimum Window Substring", "minimum-window-substring", "hard", "independent"],
  ],
  Stack: [
    ["Valid Parentheses", "valid-parentheses", "easy", "guided"],
    ["Min Stack", "min-stack", "medium", "guided"],
    ["Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "medium", "independent"],
    ["Daily Temperatures", "daily-temperatures", "medium", "independent"],
    ["Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "hard", "independent"],
  ],
  "Binary Search": [
    ["Binary Search", "binary-search", "easy", "guided"],
    ["Search a 2D Matrix", "search-a-2d-matrix", "medium", "guided"],
    ["Koko Eating Bananas", "koko-eating-bananas", "medium", "independent"],
    ["Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "medium", "independent"],
    ["Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "medium", "independent"],
  ],
  "Linked Lists": [
    ["Reverse Linked List", "reverse-linked-list", "easy", "guided"],
    ["Merge Two Sorted Lists", "merge-two-sorted-lists", "easy", "guided"],
    ["Linked List Cycle", "linked-list-cycle", "easy", "independent"],
    ["Reorder List", "reorder-list", "medium", "independent"],
    ["Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "medium", "independent"],
    ["LRU Cache", "lru-cache", "medium", "independent"],
  ],
  Trees: [
    ["Invert Binary Tree", "invert-binary-tree", "easy", "guided"],
    ["Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "easy", "guided"],
    ["Diameter of Binary Tree", "diameter-of-binary-tree", "easy", "independent"],
    ["Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "medium", "independent"],
    ["Lowest Common Ancestor of a BST", "lowest-common-ancestor-of-a-binary-search-tree", "medium", "independent"],
    ["Validate Binary Search Tree", "validate-binary-search-tree", "medium", "independent"],
  ],
  "BFS / DFS": [
    ["Number of Islands", "number-of-islands", "medium", "guided"],
    ["Max Area of Island", "max-area-of-island", "medium", "guided"],
    ["Rotting Oranges", "rotting-oranges", "medium", "independent"],
    ["Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "medium", "independent"],
    ["Course Schedule", "course-schedule", "medium", "independent"],
  ],
  Heaps: [
    ["Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "easy", "guided"],
    ["Last Stone Weight", "last-stone-weight", "easy", "guided"],
    ["K Closest Points to Origin", "k-closest-points-to-origin", "medium", "independent"],
    ["Kth Largest Element in an Array", "kth-largest-element-in-an-array", "medium", "independent"],
    ["Find Median from Data Stream", "find-median-from-data-stream", "hard", "independent"],
  ],
  Graphs: [
    ["Clone Graph", "clone-graph", "medium", "guided"],
    ["Course Schedule II", "course-schedule-ii", "medium", "guided"],
    ["Redundant Connection", "redundant-connection", "medium", "independent"],
    ["Word Ladder", "word-ladder", "hard", "independent"],
  ],
  Backtracking: [
    ["Subsets", "subsets", "medium", "guided"],
    ["Combination Sum", "combination-sum", "medium", "guided"],
    ["Permutations", "permutations", "medium", "independent"],
    ["Word Search", "word-search", "medium", "independent"],
    ["N-Queens", "n-queens", "hard", "independent"],
  ],
  "Dynamic Programming": [
    ["Climbing Stairs", "climbing-stairs", "easy", "guided"],
    ["House Robber", "house-robber", "medium", "guided"],
    ["Coin Change", "coin-change", "medium", "independent"],
    ["Longest Increasing Subsequence", "longest-increasing-subsequence", "medium", "independent"],
    ["Unique Paths", "unique-paths", "medium", "independent"],
    ["Longest Common Subsequence", "longest-common-subsequence", "medium", "independent"],
  ],
};

export type SeedTask = {
  day: number;
  title: string;
  category: string;
  estMinutes?: number;
  description?: string;
  links?: { label: string; url: string }[];
};

const neetcode = { label: "NeetCode", url: "https://neetcode.io/roadmap" };

export const WEEK_TASKS: Record<number, SeedTask[]> = {
  1: [
    { day: 1, title: "Arrays & hashing pattern", category: "InterviewPrep", estMinutes: 90, links: [neetcode] },
    { day: 1, title: "JavaScript diagnostic", category: "Engineering", estMinutes: 60, description: "Assess current JS strength; list gaps to close this week." },
    { day: 2, title: "Two pointers pattern", category: "InterviewPrep", estMinutes: 90, links: [neetcode] },
    { day: 2, title: "React fundamentals", category: "Engineering", estMinutes: 120, description: "Includes HTML/CSS and responsive UI foundations as needed.", links: [{ label: "react.dev", url: "https://react.dev/learn" }] },
    { day: 3, title: "TypeScript fundamentals", category: "Engineering", estMinutes: 120, links: [{ label: "TS Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }] },
    { day: 4, title: "Claude Code workflow", category: "AIEngineering", estMinutes: 90, description: "Set up and practice an effective Claude Code development loop.", links: [{ label: "Claude Code docs", url: "https://docs.anthropic.com/en/docs/claude-code" }] },
    { day: 5, title: "System design interview framework", category: "SystemDesign", estMinutes: 90, links: [{ label: "Hello Interview", url: "https://www.hellointerview.com/" }] },
    { day: 6, title: "Begin targeted job applications", category: "Career", estMinutes: 60, description: "Shortlist companies; send first tailored applications." },
  ],
  2: [
    { day: 1, title: "Sliding window pattern", category: "InterviewPrep", estMinutes: 90, links: [neetcode] },
    { day: 2, title: "Stack pattern", category: "InterviewPrep", estMinutes: 90, links: [neetcode] },
    { day: 3, title: "Binary search pattern", category: "InterviewPrep", estMinutes: 90, links: [neetcode] },
    { day: 1, title: "React depth", category: "Engineering", estMinutes: 120, description: "Hooks in depth, state patterns, composition." },
    { day: 2, title: "Next.js fundamentals", category: "Engineering", estMinutes: 120, links: [{ label: "Next.js Learn", url: "https://nextjs.org/learn" }] },
    { day: 4, title: "LLM API fundamentals", category: "AIEngineering", estMinutes: 90, links: [{ label: "Anthropic docs", url: "https://docs.anthropic.com/" }] },
    { day: 5, title: "Structured outputs", category: "AIEngineering", estMinutes: 90 },
    { day: 6, title: "Networking / API fundamentals", category: "SystemDesign", estMinutes: 90 },
  ],
  3: [
    { day: 1, title: "Linked lists pattern", category: "InterviewPrep", estMinutes: 90, links: [neetcode] },
    { day: 2, title: "Trees pattern", category: "InterviewPrep", estMinutes: 90, links: [neetcode] },
    { day: 1, title: "PostgreSQL setup and basics", category: "Engineering", estMinutes: 90 },
    { day: 2, title: "SQL practice", category: "Engineering", estMinutes: 90 },
    { day: 3, title: "Data modeling", category: "Engineering", estMinutes: 90 },
    { day: 4, title: "Authentication", category: "Engineering", estMinutes: 120 },
    { day: 5, title: "API design and building", category: "Engineering", estMinutes: 90 },
    { day: 5, title: "Life Companion: full-stack foundation", category: "Project", estMinutes: 180 },
    { day: 6, title: "Life Companion: basic AI integration", category: "Project", estMinutes: 120 },
  ],
  4: [
    { day: 1, title: "Trees, heaps, and intervals", category: "InterviewPrep", estMinutes: 120 },
    { day: 2, title: "Testing", category: "Engineering", estMinutes: 120 },
    { day: 3, title: "CI/CD", category: "Engineering", estMinutes: 90 },
    { day: 4, title: "Docker", category: "Engineering", estMinutes: 120 },
    { day: 5, title: "Tool calling", category: "AIEngineering", estMinutes: 90 },
    { day: 5, title: "Prompt and workflow design", category: "AIEngineering", estMinutes: 90 },
    { day: 6, title: "Life Companion: full-stack V1 deployment", category: "Project", estMinutes: 180 },
  ],
  5: [
    { day: 1, title: "Graphs pattern", category: "InterviewPrep", estMinutes: 120, links: [neetcode] },
    { day: 2, title: "BFS / DFS pattern", category: "InterviewPrep", estMinutes: 120, links: [neetcode] },
    { day: 3, title: "Retrieval", category: "AIEngineering", estMinutes: 90 },
    { day: 3, title: "RAG", category: "AIEngineering", estMinutes: 120 },
    { day: 4, title: "Context engineering", category: "AIEngineering", estMinutes: 90 },
    { day: 5, title: "Life Companion: calendar / tool integration", category: "Project", estMinutes: 150 },
    { day: 6, title: "Async and background jobs", category: "Engineering", estMinutes: 90 },
    { day: 6, title: "Scaling concepts", category: "SystemDesign", estMinutes: 90 },
  ],
  6: [
    { day: 1, title: "Backtracking pattern", category: "InterviewPrep", estMinutes: 120, links: [neetcode] },
    { day: 2, title: "Dynamic programming fundamentals", category: "InterviewPrep", estMinutes: 150, links: [neetcode] },
    { day: 3, title: "MCP", category: "AIEngineering", estMinutes: 90, links: [{ label: "MCP docs", url: "https://modelcontextprotocol.io/" }] },
    { day: 4, title: "Agent workflows", category: "AIEngineering", estMinutes: 120 },
    { day: 5, title: "Python for AI engineering", category: "Engineering", estMinutes: 120 },
    { day: 6, title: "Reliability", category: "Engineering", estMinutes: 90 },
    { day: 6, title: "Queues, workers, and storage", category: "SystemDesign", estMinutes: 90 },
  ],
  7: [
    { day: 1, title: "Mixed timed interview practice", category: "InterviewPrep", estMinutes: 120 },
    { day: 3, title: "Mixed timed interview practice", category: "InterviewPrep", estMinutes: 120 },
    { day: 2, title: "Evals", category: "AIEngineering", estMinutes: 120 },
    { day: 4, title: "AI quality feedback loops", category: "AIEngineering", estMinutes: 90 },
    { day: 5, title: "Observability", category: "Engineering", estMinutes: 90 },
    { day: 5, title: "Life Companion: UX polish", category: "Project", estMinutes: 120 },
    { day: 6, title: "System design practice interviews", category: "SystemDesign", estMinutes: 120 },
  ],
  8: [
    { day: 1, title: "Coding mocks", category: "InterviewPrep", estMinutes: 120 },
    { day: 2, title: "System design mocks", category: "SystemDesign", estMinutes: 120 },
    { day: 3, title: "Behavioral prep", category: "Career", estMinutes: 90 },
    { day: 3, title: "Verification and retries", category: "AIEngineering", estMinutes: 90 },
    { day: 4, title: "AI safety and reliability", category: "AIEngineering", estMinutes: 90 },
    { day: 4, title: "Latency and cost analysis", category: "AIEngineering", estMinutes: 60 },
    { day: 5, title: "Docker / Kubernetes review", category: "Engineering", estMinutes: 90, description: "K8s conceptually only: cluster, node, pod, deployment, service, ingress, ConfigMap/Secret, replicas, health checks, autoscaling." },
    { day: 5, title: "Life Companion: deployment", category: "Project", estMinutes: 120 },
    { day: 6, title: "Portfolio and case-study polish", category: "Career", estMinutes: 120 },
    { day: 7, title: "Heavy applications and interviewing", category: "Career", estMinutes: 120 },
  ],
};

// Track C (applications / networking / pipeline) runs every week, not just
// weeks 1 and 8 (curriculum.md, priority #2).
for (let week = 2; week <= 7; week++) {
  WEEK_TASKS[week].push({
    day: 6,
    title: "Applications and networking",
    category: "Career",
    estMinutes: 60,
    description:
      "Send tailored applications; pursue referrals; keep resume/GitHub sharp. If an interview is scheduled, company-specific prep outranks the normal curriculum.",
  });
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
