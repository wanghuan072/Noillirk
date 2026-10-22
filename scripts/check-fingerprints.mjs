import fs from "node:fs";
import path from "node:path";
import { tdk } from "../seo/tdk.js";
import { selectGames } from "../lib/recommendations.ts";
import { fingerprint, reconcile } from "../seo/fingerprints.mjs";
import { articleMedia } from "../lib/article-media.mjs";
import { legalText } from "../lib/legal-text.ts";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const main = read("data/games/main-game.json"),
  allGames = read("data/games/games.json");
const games = allGames;
const guides = fs
  .readdirSync("data/guides")
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ file: "data/guides/" + f, ...read("data/guides/" + f) }));
const caps = read("planning/site-capabilities.json").features,
  legal = read("data/site/legal.json"),
  config = read("config/site.json");
const media = (src) =>
  src
    ? {
        path: src,
        bytes: fs.existsSync(path.join("public", src))
          ? fingerprint(
              fs.readFileSync(path.join("public", src)).toString("base64"),
            )
          : null,
      }
    : null;
const card = (g, compact = false) => ({
  id: g.id,
  slug: g.slug,
  title: g.title,
  ...(!compact ? { shortDescription: g.shortDescription } : {}),
  image: g.image,
  media: media(g.image.src),
});
const guideCard = (g) => ({
  id: g.id,
  slug: g.slug,
  title: g.title,
  summary: g.summary,
  cover: g.cover,
  media: media(g.cover.src),
});
const shared = {
  config: {
    name: config.name,
    origin: config.origin,
    navigation: config.navigation,
  },
  logo: media("/images/logo.png"),
  social: media("/images/og-image.png"),
  icon: media("/images/icon.png"),
  appleIcon: media("/images/apple-touch-icon.png"),
  footerYear: new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
  }).format(new Date()),
  legalLinks: Object.entries(legal).map(([id, p]) => [id, p.title]),
};
const payloads = {};
const page = (route, value) => {
  payloads[route] = { shared, ...value };
};
page("/games", { seo: tdk.games, cards: games.map((g) => card(g)) });
page("/guides", { seo: tdk.guides, cards: guides.map(guideCard) });
for (const [id, p] of Object.entries(legal))
  page("/" + id, {
    seo: tdk[id],
    title: p.title,
    sections: p.sections
      .filter(
        (s) => !s.requiresCapability || caps[s.requiresCapability]?.enabled,
      )
      .map(({ heading, text }) => ({
        heading,
        text: legalText(text, {
          domain: new URL(config.origin).hostname,
          email: config.email,
        }),
      })),
  });
for (const g of [main, ...games]) {
  const selections = selectGames(g, games, g.id === main.id);
  page(g.id === main.id ? "/" : "/games/" + g.slug, {
    game: {
      id: g.id,
      publishedAt: g.publishedAt,
      title: g.title,
      shortDescription: g.shortDescription,
      image: g.image,
      media: media(g.image.src),
      player: g.player,
      seo: g.seo,
      content: g.content,
      articleMedia: articleMedia(g.content, media),
    },
    selections: {
      featured: selections.featured.map((g) => card(g, true)),
      newest: selections.newest.map((g) => card(g, true)),
      recommended: selections.recommended.map((g) => card(g)),
    },
  });
}
for (const g of guides)
  page("/guides/" + g.slug, {
    guide: {
      id: g.id,
      publishedAt: g.publishedAt,
      title: g.title,
      summary: g.summary,
      tags: g.tags,
      authorId: g.authorId,
      cover: g.cover,
      media: media(g.cover.src),
      seo: g.seo,
      sections: g.sections,
      articleMedia: articleMedia(g.sections, media),
    },
    related: g.relatedGuideIds.flatMap((id) => {
      const r = guides.find((x) => x.id === id);
      return r ? [guideCard(r)] : [];
    }),
  });
const file = "seo/page-lastmod.json",
  previous = fs.existsSync(file) ? read(file).pages : {},
  update = process.argv.includes("--update");
const result = reconcile(
  previous,
  payloads,
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()),
  update,
);
if (update) {
  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        scope:
          "all normal pages from Game and Guide data; inclusion does not grant publication approval",
        pages: result.pages,
      },
      null,
      2,
    ) + "\n",
  );
  for (const g of [main, ...games, ...guides].filter(
    (g) => g.status === "published",
  )) {
    const route =
      g.id === main.id
        ? "/"
        : g.sections
          ? "/guides/" + g.slug
          : "/games/" + g.slug;
    g.updatedAt = result.pages[route].lastModified;
  }
  if (main.status === "published")
    fs.writeFileSync(
      "data/games/main-game.json",
      JSON.stringify(main, null, 2) + "\n",
    );
  fs.writeFileSync(
    "data/games/games.json",
    JSON.stringify(allGames, null, 2) + "\n",
  );
  for (const g of guides) {
    const { file: target, ...record } = g;
    fs.writeFileSync(target, JSON.stringify(record, null, 2) + "\n");
  }
}
const output = {
  mode: update ? "update" : "read-only",
  checkedAt: new Date().toISOString(),
  scope: "all normal data routes; release eligibility checked separately",
  result: result.errors.length ? "failed" : "passed",
  routes: Object.keys(payloads),
  errors: result.errors,
};
fs.writeFileSync(
  "reports/fingerprint-results.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log(JSON.stringify(output, null, 2));
process.exitCode = result.errors.length ? 1 : 0;
