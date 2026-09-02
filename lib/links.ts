// Task/topic/milestone links are stored as a JSON string column in SQLite.
// In edit forms they are entered one per line as "Label | https://url"
// (or just a bare URL).

export type LinkItem = { label: string; url: string };

export function parseLinksJson(json: string): LinkItem[] {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is LinkItem =>
        typeof l === "object" && l !== null && typeof l.url === "string"
    );
  } catch {
    return [];
  }
}

export function linksToTextarea(json: string): string {
  return parseLinksJson(json)
    .map((l) => (l.label && l.label !== l.url ? `${l.label} | ${l.url}` : l.url))
    .join("\n");
}

export function textareaToLinksJson(text: string): string {
  const links: LinkItem[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const sep = line.indexOf("|");
    if (sep !== -1) {
      const label = line.slice(0, sep).trim();
      const url = line.slice(sep + 1).trim();
      if (url) links.push({ label: label || url, url });
    } else {
      links.push({ label: line, url: line });
    }
  }
  return JSON.stringify(links);
}
