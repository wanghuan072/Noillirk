import { test } from "node:test";
import assert from "node:assert/strict";
import { reconcile } from "../seo/fingerprints.mjs";
test("unchanged visible payload retains dates even when time advances", () => {
  const payload = { "/": { body: "A", recommended: ["one", "two"] } };
  const a = reconcile({}, payload, "2026-10-20", true);
  const b = reconcile(a.pages, payload, "2027-01-01", true);
  assert.deepEqual(a.pages, b.pages);
  assert.deepEqual(reconcile(b.pages, payload, "2027-01-02").errors, []);
});
test("read-only rejects changes; updated recommendations affect only their page", () => {
  const payload = {
    "/": { body: "A", recommended: ["one", "two"] },
    "/guides": { cards: ["guide"] },
  };
  const a = reconcile({}, payload, "2026-10-20", true);
  const changed = {
    "/": { body: "A", recommended: ["one", "three"] },
    "/guides": payload["/guides"],
  };
  assert.equal(reconcile(a.pages, changed, "2026-10-21").errors.length, 1);
  const b = reconcile(a.pages, changed, "2026-10-21", true);
  assert.equal(b.pages["/"].lastModified, "2026-10-21");
  assert.deepEqual(b.pages["/guides"], a.pages["/guides"]);
});

test("adding a detail page changes only its own date", () => {
  const original = { "/games/a": { text: "A" }, "/guides/one": { text: "B" } };
  const before = reconcile({}, original, "2026-10-20", true);
  const after = reconcile(
    before.pages,
    { ...original, "/guides/two": { text: "C" } },
    "2026-10-22",
    true,
  );
  assert.deepEqual(after.pages["/games/a"], before.pages["/games/a"]);
  assert.deepEqual(after.pages["/guides/one"], before.pages["/guides/one"]);
  assert.equal(after.pages["/guides/two"].lastModified, "2026-10-22");
});
