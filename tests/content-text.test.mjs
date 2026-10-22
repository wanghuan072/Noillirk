import { test } from "node:test";
import assert from "node:assert/strict";
import { articleText, nonWhitespaceCharacters } from "../lib/content-text.mjs";
test("closed FAQ answers and media cannot inflate the article character floor", () => {
  const text = articleText([
    {
      heading: "Task",
      blocks: [
        { type: "paragraph", text: "Visible words" },
        {
          type: "faq",
          items: [{ question: "Why?", answer: "hidden ".repeat(1000) }],
        },
        {
          type: "image",
          alt: "alt ".repeat(1000),
          caption: "caption ".repeat(1000),
        },
        {
          type: "video",
          title: "video ".repeat(1000),
          description: "video ".repeat(1000),
        },
      ],
    },
  ]);
  assert.equal(nonWhitespaceCharacters(text), "TaskVisiblewordsWhy?".length);
});
test("Guide headings and displayed steps/tables count with NFC normalization", () => {
  const text = articleText([
    {
      title: "Guide",
      blocks: [
        { type: "steps", items: [{ title: "Move", body: "one tile" }] },
        { type: "table", columns: ["Action"], rows: [["Tap"]] },
        { type: "paragraph", text: "e\u0301" },
      ],
    },
  ]);
  assert.equal(
    nonWhitespaceCharacters(text),
    [..."GuideMoveonetileActionTapé"].length,
  );
});
