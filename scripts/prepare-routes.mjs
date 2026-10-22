import fs from "node:fs";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const games = read("data/games/games.json"),
  guides = fs
    .readdirSync("data/guides")
    .filter((f) => f.endsWith(".json"))
    .map((f) => read("data/guides/" + f));
const base = [
  "/",
  "/games",
  "/guides",
  "/privacy",
  "/terms",
  "/copyright",
  "/about",
  "/contact",
];
const detail = (records, prefix, published) =>
  records
    .filter((g) => !published || g.status === "published")
    .map((g) => prefix + g.slug);
const publicPaths = [
  ...base,
  ...detail(games, "/games/", true),
  ...detail(guides, "/guides/", true),
];
const draftPaths = [
  ...base,
  ...detail(games, "/games/", false),
  ...detail(guides, "/guides/", false),
];
const previewPaths = draftPaths.map((p) => "/preview" + (p === "/" ? "" : p));
fs.writeFileSync(
  "config/routes.json",
  JSON.stringify({ publicPaths, draftPaths, previewPaths }, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    public: publicPaths.length,
    isolatedDraft: previewPaths.length,
  }),
);
