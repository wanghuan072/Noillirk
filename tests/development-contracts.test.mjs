import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { sidebarTop } from "../lib/sidebar-position.ts";
import { inspectImage } from "../lib/asset-inspection.mjs";
import { articleMedia } from "../lib/article-media.mjs";
import { reconcile } from "../seo/fingerprints.mjs";
test("sidebar starts below the measured Header, including after a mobile reset", () => {
  for (const headerHeight of [64, 97, 132])
    assert.equal(
      sidebarTop({
        previous: null,
        scrollDelta: 0,
        headerHeight,
        viewportHeight: 900,
        sidebarHeight: 300,
      }),
      headerHeight + 20,
    );
});
test("tall sidebar follows both directions and exposes its bottom without inner scrolling", () => {
  const dimensions = {
    headerHeight: 80,
    viewportHeight: 900,
    sidebarHeight: 1100,
  };
  let position = sidebarTop({ ...dimensions, previous: null, scrollDelta: 0 });
  assert.equal(position, 100);
  position = sidebarTop({
    ...dimensions,
    previous: position,
    scrollDelta: 1000,
  });
  assert.equal(position, -220);
  assert.equal(position + dimensions.sidebarHeight, 880);
  position = sidebarTop({
    ...dimensions,
    previous: position,
    scrollDelta: -140,
  });
  assert.equal(position, -80);
  assert.equal(
    sidebarTop({ ...dimensions, previous: position, scrollDelta: -1000 }),
    100,
  );
});
test("image dimensions, file bytes and hash are checked against decoded original asset", async () => {
  const ledger = JSON.parse(fs.readFileSync("research/media-ledger.json"));
  const entry = ledger.items.find((m) => m.id === "site-logo");
  const bytes = fs.readFileSync("public" + entry.localPath);
  assert.deepEqual((await inspectImage(bytes, entry)).issues, []);
  const wrong = await inspectImage(bytes, {
    ...entry,
    width: entry.width + 1,
    sha256: "0".repeat(64),
    fileBytes: 0,
  });
  assert.equal(wrong.issues.length, 3);
  assert.ok(
    (await inspectImage(Buffer.from("not an image"), entry)).issues.some((e) =>
      e.includes("cannot be decoded"),
    ),
  );
});
test("replacing a body capture or optional video poster changes only that page's date", () => {
  const sections = [
    {
      blocks: [
        { type: "image", src: "/images/capture.png" },
        { type: "video", poster: { src: "/images/poster.png" } },
      ],
    },
  ];
  const make = (capture, poster) => ({
    "/games/a": {
      media: articleMedia(sections, (src) => ({
        src,
        hash: src.includes("capture") ? capture : poster,
      })),
    },
    "/games/b": { body: "unchanged" },
  });
  const before = reconcile({}, make("one", "one"), "2026-10-20", true);
  for (const after of [make("two", "one"), make("one", "two")]) {
    const next = reconcile(before.pages, after, "2026-10-21", true);
    assert.equal(next.pages["/games/a"].lastModified, "2026-10-21");
    assert.deepEqual(next.pages["/games/b"], before.pages["/games/b"]);
  }
});
