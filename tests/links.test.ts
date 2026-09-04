import { describe, expect, it } from "vitest";
import {
  linksToTextarea,
  parseLinksJson,
  textareaToLinksJson,
} from "@/lib/links";

describe("parseLinksJson", () => {
  it("parses a valid links array", () => {
    expect(parseLinksJson('[{"label":"Docs","url":"https://a.dev"}]')).toEqual([
      { label: "Docs", url: "https://a.dev" },
    ]);
  });

  it("returns [] for malformed JSON, non-arrays, and entries without urls", () => {
    expect(parseLinksJson("not json")).toEqual([]);
    expect(parseLinksJson('{"url":"https://a.dev"}')).toEqual([]);
    expect(parseLinksJson('[{"label":"no url"}]')).toEqual([]);
  });
});

describe("textarea round trip", () => {
  it("parses 'Label | url' lines and bare urls", () => {
    const json = textareaToLinksJson(
      "React docs | https://react.dev\nhttps://nextjs.org\n\n"
    );
    expect(parseLinksJson(json)).toEqual([
      { label: "React docs", url: "https://react.dev" },
      { label: "https://nextjs.org", url: "https://nextjs.org" },
    ]);
  });

  it("survives a full round trip unchanged", () => {
    const text = "React docs | https://react.dev\nhttps://nextjs.org";
    const once = textareaToLinksJson(text);
    const twice = textareaToLinksJson(linksToTextarea(once));
    expect(twice).toBe(once);
  });
});
