import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validate } from "../scripts/validate.mjs";
const current = JSON.parse(fs.readFileSync("data/games/games.json"));
const check = (mutate, mode = "draft") => {
  const additional = structuredClone(current);
  mutate(additional);
  return validate(mode, { additional });
};
test("invalid dimensions, identity types, text and aspect ratios block data use", () => {
  for (const [mutate, message] of [
    [
      (g) => {
        g[0].player.minimumHeight = -1;
      },
      "minimum player height",
    ],
    [
      (g) => {
        g[0].id = 123;
      },
      "invalid ID",
    ],
    [
      (g) => {
        g[0].title = "";
      },
      "title required",
    ],
    [
      (g) => {
        g[0].player.aspectRatio = "0 / 1";
      },
      "aspect ratio",
    ],
    [
      (g) => {
        g[0].player.aspectRatio = "1 / garbage";
      },
      "aspect ratio",
    ],
  ])
    assert.ok(check(mutate).errors.some((e) => e.includes(message)));
});
test("draft dates stay null and impossible calendar dates are refused", () => {
  assert.ok(
    check((g) => {
      g[0].publishedAt = "2026-10-01";
    }).errors.some((e) => e.includes("draft dates")),
  );
  assert.ok(
    check((g) => {
      g[0].status = "published";
      g[0].publishedAt = "2026-02-31";
      g[0].updatedAt = "2026-03-10";
    }).errors.some((e) => e.includes("invalid date")),
  );
  assert.ok(
    check((g) => {
      g[0].status = "published";
      g[0].publishedAt = "2026-03-10";
      g[0].updatedAt = "2026-03-01";
    }).errors.some((e) => e.includes("predates")),
  );
});
test("an approved Guide asset cannot stand in for another game's cover", () => {
  const guide = JSON.parse(
    fs.readFileSync("data/guides/noillirk-answer-strategy.json"),
  );
  assert.ok(
    check((g) => {
      g[0].image = guide.cover;
    }).errors.some((e) => e.includes("cover belongs to another game")),
  );
});
test("an unused valid draft need not satisfy public media/text gates", () => {
  const result = check((g) => {
    g.push({
      ...structuredClone(g[0]),
      id: "fixture-draft",
      slug: "fixture-draft",
      title: "Unpublished fixture",
      shortDescription: "",
      image: { src: "", alt: "", width: null, height: null },
      content: [],
      relatedGameIds: [],
      seo: { title: "", description: "" },
      flags: {
        isNewHome: false,
        isFeaturedHome: false,
        isRecommendedHome: false,
      },
    });
  }, "release");
  assert.equal(result.result, "failed");
  assert.ok(result.errors.some((e) => e.includes("eight published")));
  assert.ok(!result.errors.some((e) => e.startsWith("Game fixture-draft:")));
  assert.ok(!result.errors.some((e) => e.startsWith("Game fixture-draft SEO")));
});

test("unresolved provider errors block release without blocking draft work", () => {
  const result = validate("release");
  for (const id of ["crowds-preinit-resize", "sandspiel-zero-width-ad-slot"])
    assert.ok(
      result.errors.some((e) => e.includes("unresolved runtime issue " + id)),
    );
  assert.equal(validate("draft").result, "passed");
});
test("a resolved runtime review cannot be reused after changing the iframe URL", () => {
  const game = current.find((g) => g.id === "crowds");
  const issue = {
    id: "fixture",
    gameId: game.id,
    iframeSrc: game.player.iframeSrc,
    status: "resolved",
  };
  assert.equal(
    validate("release", { runtimeIssues: [issue] }).errors.some((e) =>
      e.includes("unresolved runtime issue fixture"),
    ),
    false,
  );
  issue.iframeSrc = "https://example.com/old-version";
  assert.ok(
    validate("release", { runtimeIssues: [issue] }).errors.some((e) =>
      e.includes("unresolved runtime issue fixture"),
    ),
  );
});
