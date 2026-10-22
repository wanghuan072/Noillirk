import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { selectGames } from "../lib/recommendations.ts";
const main = JSON.parse(fs.readFileSync("data/games/main-game.json"));
const games = JSON.parse(fs.readFileSync("data/games/games.json"));
test("real draft recommendation sets use each own ID and exclude the current game", () => {
  for (const current of [main, ...games])
    for (const [group, items] of Object.entries(
      selectGames(current, games, current.id === main.id),
    )) {
      assert.equal(new Set(items.map((g) => g.id)).size, items.length);
      assert.ok(!items.some((g) => g.id === current.id));
      assert.ok(items.every((g) => games.find((x) => x.id === g.id) === g));
      assert.ok(
        group === "recommended"
          ? items.length === 6
          : items.length >= 6 && items.length <= 8,
      );
    }
});
test("detail groups prefer unshown candidates when inventory supports them", () => {
  const pool = Array.from({ length: 18 }, (_, i) => ({
    ...games[0],
    id: "g" + i,
    flags: {
      isFeaturedHome: i < 6,
      isNewHome: i < 12,
      isRecommendedHome: false,
    },
    relatedGameIds: [],
  }));
  const result = selectGames({ ...main, relatedGameIds: [] }, pool, false);
  const all = Object.values(result)
    .flat()
    .map((g) => g.id);
  assert.equal(all.length, 18);
  assert.equal(new Set(all).size, 18);
});
test("home flags are authoritative and incomplete or duplicate inventories fail", () => {
  const result = selectGames(main, games, true);
  assert.deepEqual(
    new Set(result.featured.map((g) => g.id)),
    new Set(games.filter((g) => g.flags.isFeaturedHome).map((g) => g.id)),
  );
  assert.throws(() => selectGames(main, [], true), /incomplete/);
  assert.throws(
    () => selectGames(main, [...games, games[0]], true),
    /duplicate/,
  );
});
