import fs from "node:fs";
import { articleText, nonWhitespaceCharacters } from "../lib/content-text.mjs";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const games = [
  read("data/games/main-game.json"),
  ...read("data/games/games.json"),
];
const guides = fs
  .readdirSync("data/guides")
  .filter((f) => f.endsWith(".json"))
  .map((f) => read("data/guides/" + f));
const blueprints = read("planning/page-content-blueprints.json").pages;
const briefs = read("research/game-content-briefs.json").games;
const rows = [],
  errors = [],
  paragraphs = new Map();
for (const record of [...games, ...guides]) {
  const isGame = Array.isArray(record.content);
  const sections = isGame ? record.content : record.sections;
  const page = blueprints.find((p) =>
    isGame ? p.gameId === record.id : p.pageId === record.id,
  );
  const planned = new Set(page?.sections?.map((s) => s.id) || []);
  const sectionIds = sections.map((s) => s.id);
  for (const id of sectionIds)
    if (!planned.has(id))
      errors.push(record.id + ": section lacks blueprint " + id);
  if (isGame) {
    const brief = briefs.find((b) => b.game_id === record.id);
    for (const id of sectionIds)
      if (!brief?.sections?.includes(id))
        errors.push(record.id + ": section lacks content brief " + id);
  }
  for (const section of sections) {
    if (
      /\b(summary|references|sources|resource library)\b/i.test(
        section.heading || section.title,
      )
    )
      errors.push(record.id + ": internal/report heading in public article");
    for (const b of section.blocks.filter((b) => b.type === "paragraph")) {
      const normalized = b.text.normalize("NFC").replace(/\s+/g, " ").trim();
      const owners = paragraphs.get(normalized) || new Set();
      owners.add(record.id);
      paragraphs.set(normalized, owners);
    }
  }
  const count = nonWhitespaceCharacters(articleText(sections));
  rows.push({
    id: record.id,
    route: isGame
      ? record === games[0]
        ? "/"
        : "/games/" + record.slug
      : "/guides/" + record.slug,
    status: record.status,
    sections: sectionIds.length,
    staticExpectedArticleCharacters: count,
    characterFloor: isGame
      ? count >= 4000
        ? "met-statically"
        : "below-floor"
      : "not-applicable",
    browserMeasurement: "not_run_this_revision",
    contentAcceptance: "not_assessed",
  });
}
for (const owners of paragraphs.values())
  if (owners.size > 1)
    errors.push("Exact paragraph reused across: " + [...owners].join(", "));
const report = {
  checkedAt: new Date().toISOString(),
  method:
    "Static JSON article-text extraction; excludes image/media text and closed FAQ answers. Does not establish rendered visibility, fact completeness, originality beyond exact matches, or content acceptance.",
  staticChecks: errors.length ? "failed" : "passed",
  contentAcceptance: "NOT_PASSED",
  mediaAcceptance: "NOT_PASSED",
  rows,
  errors,
};
fs.writeFileSync(
  "reports/content-static-results.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      staticChecks: report.staticChecks,
      games: games.length,
      guides: guides.length,
      errors,
    },
    null,
    2,
  ),
);
process.exitCode = errors.length ? 1 : 0;
