import fs from "node:fs";
import { tdk } from "../seo/tdk.js";
const games = JSON.parse(fs.readFileSync("data/games/games.json"));
const guides = fs
  .readdirSync("data/guides")
  .filter((x) => x.endsWith(".json"))
  .map((x) => JSON.parse(fs.readFileSync("data/guides/" + x)));
const all = [
  ...Object.entries(tdk).map(([id, seo]) => ({ id, seo })),
  ...games,
  ...guides,
];
const seen = new Set();
const items = all.map((g) => {
  const titleLength = [...g.seo.title.trim()].length,
    descriptionLength = [...g.seo.description.trim()].length;
  const duplicate = seen.has(g.seo.title);
  seen.add(g.seo.title);
  return {
    id: g.id,
    title: g.seo.title,
    titleLength,
    descriptionLength,
    duplicate,
    result:
      titleLength >= 40 &&
      titleLength <= 60 &&
      descriptionLength >= 140 &&
      descriptionLength <= 160 &&
      !duplicate
        ? "passed"
        : "failed",
  };
});
fs.writeFileSync(
  "reports/seo-field-checks.json",
  JSON.stringify(
    { scope: "Data fields only; not release/runtime acceptance", items },
    null,
    2,
  ),
);
console.log(JSON.stringify(items, null, 2));
process.exitCode = items.some((i) => i.result === "failed") ? 1 : 0;
