import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { safeFrameUrl, frameOrigins } from "../lib/security.ts";
import { validate } from "../scripts/validate.mjs";
test("video policy follows actual Game and Guide video blocks", () => {
  const game = {
    player: { iframeSrc: "https://playdaily.org/a" },
    content: [
      {
        blocks: [
          { type: "video", provider: "youtube", videoId: "oMe1Mz3Maoo" },
        ],
      },
    ],
  };
  assert.deepEqual(frameOrigins([game]), [
    "https://playdaily.org",
    "https://www.youtube-nocookie.com",
  ]);
  assert.deepEqual(
    frameOrigins(
      [],
      [
        {
          blocks: [{ type: "video", provider: "youtube", videoId: "invalid" }],
        },
      ],
    ),
    [],
  );
  assert.deepEqual(
    frameOrigins(
      [],
      [
        {
          blocks: [
            { type: "video", provider: "youtube", videoId: "oMe1Mz3Maoo" },
          ],
        },
      ],
    ),
    ["https://www.youtube-nocookie.com"],
  );
});
test("unsafe protocols and credentials cannot create game frames", () => {
  for (const u of [
    "javascript:alert(1)",
    "data:text/html,a",
    "http://public.net",
    "https://user:pass@public.net",
    "not a URL",
    "",
  ])
    assert.equal(safeFrameUrl(u), null);
});
test("local, reserved and numeric hosts cannot enter published frame policy", () => {
  for (const u of [
    "https://localhost",
    "https://a.local",
    "https://127.0.0.1",
    "https://2130706433",
    "https://[::1]",
    "https://site.test",
    "https://example.com",
    "https://service.internal",
    "https://public.net:8080",
  ])
    assert.equal(safeFrameUrl(u), null);
});
test("policy derives and deduplicates current configured origins", () => {
  const a = { player: { iframeSrc: "https://playdaily.org/a" } },
    b = { player: { iframeSrc: "https://playdaily.org/b" } },
    c = { player: { iframeSrc: "javascript:x" } };
  assert.deepEqual(frameOrigins([a, b, c]), ["https://playdaily.org"]);
});
test("main game configuration drives its origin and is absent from additional identities", () => {
  const main = JSON.parse(fs.readFileSync("data/games/main-game.json"));
  const games = JSON.parse(fs.readFileSync("data/games/games.json"));
  assert.equal(typeof main.player.iframeSrc, "string");
  assert(main.player.iframeSrc.length > 0);
  const safe = safeFrameUrl(main.player.iframeSrc);
  assert.deepEqual(frameOrigins([main]), safe ? [safe.origin] : []);
  assert(!games.some((g) => g.id === main.id || g.slug === main.slug));
});
test("drafts parse while release and media checks reject missing evidence", () => {
  assert.equal(validate("draft").result, "passed");
  assert.equal(validate("media").result, "failed");
  const release = validate("release");
  assert.equal(release.result, "failed");
  assert(release.errors.some((e) => e.includes("eight published")));
});
test("base navigation and Legal routes match locked project scope", () => {
  const map = JSON.parse(fs.readFileSync("planning/content-map.json"));
  assert.deepEqual(
    map.primaryNavigation.map((n) => [n.label, n.path]),
    [
      ["Home", "/"],
      ["Guides", "/guides"],
      ["More Games", "/games"],
    ],
  );
  assert(!map.pages.some((p) => p.path === "/games/noillirk"));
  assert.deepEqual(
    map.utilityPages.map((p) => p.path),
    ["/privacy", "/terms", "/copyright", "/about", "/contact"],
  );
});
