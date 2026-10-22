const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const main = read("data/games/main-game.json");
main.shortDescription =
  "Read a category, choose a familiar answer, and see how far your guess carries a balloon climb.";
write("data/games/main-game.json", main);
const cov = read("planning/game-coverage.json").items.filter(
  (x) => x.draftImplementation,
);
const candidates = read("research/additional-game-candidates.json").candidates;
write(
  "data/games/games.json",
  cov.map((x) => {
    const c = candidates.find((c) => c.id === x.game_id);
    return {
      ...main,
      id: c.id,
      slug: c.proposedSlug,
      title: c.title,
      shortDescription:
        c.playerTaskProfile.task + ". " + c.playerTaskProfile.feedback + ".",
      tags: [],
      categories: [],
      flags: x.home_flags,
      player: {
        ...main.player,
        iframeSrc: c.provisionalIframeCandidate,
        sandbox: ["allow-scripts", "allow-same-origin"],
        referrerPolicy: "strict-origin-when-cross-origin",
      },
      content: [],
      relatedGameIds: [],
    };
  }),
);
fs.mkdirSync("data/guides", { recursive: true });
for (const g of read("research/intent-clusters.json").guideCandidates) {
  const file = "data/guides/" + g.slug + ".json";
  if (!fs.existsSync(file))
    write(file, {
      id: g.id,
      slug: g.slug,
      status: "draft",
      title: g.id.includes("scoring")
        ? "Noillirk scoring and Endless balloons"
        : "Choose a familiar answer in Noillirk",
      summary: "",
      tags: [],
      authorId: null,
      spoilerPolicy: "marked",
      publishedAt: null,
      updatedAt: null,
      cover: { src: "", alt: "", width: null, height: null },
      seo: { title: "", description: "" },
      sections: [],
      relatedGuideIds: [],
    });
}
console.log(
  "Eight isolated-preview Game drafts and two Guide drafts created; no record published.",
);
