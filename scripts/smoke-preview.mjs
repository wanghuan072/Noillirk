import fs from "node:fs";
const origin = "http://127.0.0.1:4318",
  read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const buildId = fs.readFileSync(".next-preview/BUILD_ID", "utf8").trim(),
  commands = read("reports/command-results.json");
const service = commands.commands.findLast(
  (c) => c.kind === "service" && c.status === "running" && c.port === 4318,
);
if (
  !service ||
  service.buildIdentity !== buildId ||
  service.readiness.result !== "ready"
)
  throw new Error("No current-build ready service record");
const games = read("data/games/games.json"),
  guides = fs
    .readdirSync("data/guides")
    .filter((f) => f.endsWith(".json"))
    .map((f) => read("data/guides/" + f));
const routes = [
  "/preview",
  "/preview/games",
  "/preview/guides",
  ...games.map((g) => "/preview/games/" + g.slug),
  ...guides.map((g) => "/preview/guides/" + g.slug),
  ...["privacy", "terms", "copyright", "about", "contact"].map(
    (s) => "/preview/" + s,
  ),
];
routes.push("/privacy", "/terms", "/copyright", "/about", "/contact");
const checks = [],
  assets = new Set();
for (const route of routes) {
  const r = await fetch(origin + route),
    html = await r.text();
  for (const m of html.matchAll(
    /(?:src|href)="(\/_next\/static\/[^"?]+)(?:\?[^"\s]+)?"/g,
  ))
    assets.add(m[1]);
  checks.push({
    route,
    status: r.status,
    noindex: r.headers.get("x-robots-tag")?.includes("noindex"),
    productionCspHasEval: r.headers
      .get("content-security-policy")
      ?.includes("'unsafe-eval'"),
    h1Count: [...html.matchAll(/<h1(?:\s|>)/g)].length,
    gameFramesBeforePlay: [...html.matchAll(/<iframe\b/g)].length,
    result:
      r.status === 200 &&
      r.headers.get("x-robots-tag")?.includes("noindex") &&
      !r.headers.get("content-security-policy")?.includes("'unsafe-eval'")
        ? "passed"
        : "failed",
  });
}
for (const route of [
  "/games/noillirk",
  "/preview/games/noillirk",
  "/legal/privacy",
  "/research/video-analysis.json",
  "/games/fermi",
  "/guides/noillirk-answer-strategy",
]) {
  const r = await fetch(origin + route);
  checks.push({
    route,
    expected: 404,
    status: r.status,
    result: r.status === 404 ? "passed" : "failed",
  });
}
const assetChecks = await Promise.all(
  [...assets].map(async (route) => {
    const r = await fetch(origin + route);
    return {
      route,
      status: r.status,
      contentType: r.headers.get("content-type"),
      cache: r.headers.get("cache-control"),
      result: r.status === 200 ? "passed" : "failed",
    };
  }),
);
const report = {
  buildId,
  origin,
  pid: service.pid,
  checkedAt: new Date().toISOString(),
  scope:
    "Isolated local draft HTTP checks; not release, gameplay or media acceptance",
  routeChecks: checks,
  assetChecks,
  counts: {
    routes: checks.length,
    assets: assetChecks.length,
    failed: [...checks, ...assetChecks].filter((x) => x.result === "failed")
      .length,
  },
};
fs.writeFileSync(
  "reports/preview-http-results.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report.counts));
process.exitCode = report.counts.failed ? 1 : 0;
