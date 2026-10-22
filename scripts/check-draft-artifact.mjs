import fs from "node:fs";
import path from "node:path";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const directory = ".next-preview";
const identity = read(`${directory}/build-identity.json`);
const routes = read("config/routes.json").draftPaths;
const games = read("data/games/games.json");
const rows = routes.map((route) => {
  const file = path.join(
    directory,
    "server/app",
    route === "/" ? "index.html" : route.slice(1) + ".html",
  );
  const errors = [];
  if (!fs.existsSync(file))
    return {
      route,
      file,
      result: "failed",
      errors: ["Compiled normal-path HTML absent"],
    };
  const html = fs.readFileSync(file, "utf8");
  if (/href="\/preview(?:\/|"|\?)/.test(html))
    errors.push("Legacy prefix in compiled navigation");
  if (!html.includes('rel="canonical"')) errors.push("Canonical absent");
  if (!html.includes("application/ld+json"))
    errors.push("Structured data absent");
  if (!html.includes("/images/og-image.png"))
    errors.push("Shared social image absent");
  if (/Local draft preview|Cover unadopted|Local player test/.test(html))
    errors.push("Internal draft copy exposed");
  const game = games.find((g) => route === "/games/" + g.slug);
  if (game) {
    if (!html.includes(game.image.src)) errors.push("Current cover absent");
    if (!html.includes(`data-game-id="${game.id}"`))
      errors.push("Current player identity absent");
    if (!html.includes("Play Now")) errors.push("Real play control absent");
    if (!html.includes(`data-article-game-id="${game.id}"`))
      errors.push("Independent article absent");
    for (const block of game.content.flatMap((s) => s.blocks)) {
      if (block.type === "image" && !html.includes(block.src))
        errors.push("Current body image absent: " + block.src);
      if (
        block.type === "video" &&
        !html.includes("youtube-nocookie.com/embed/" + block.videoId)
      )
        errors.push("Current video absent");
    }
  }
  return { route, file, result: errors.length ? "failed" : "passed", errors };
});
const headers = read(`${directory}/routes-manifest.json`).headers;
const csp = headers
  .flatMap((r) => r.headers)
  .filter((h) => h.key.toLowerCase() === "content-security-policy");
const policyErrors = [];
if (!csp.length) policyErrors.push("No compiled CSP");
if (csp.some((h) => h.value.includes("'unsafe-eval'")))
  policyErrors.push("Production compilation includes unsafe-eval");
const report = {
  checkedAt: new Date().toISOString(),
  buildId: identity.buildId,
  sourceFingerprint: identity.sourceFingerprint,
  method:
    "Read compiled normal-route HTML and route headers without starting a service",
  rows,
  policyErrors,
  result:
    rows.some((r) => r.errors.length) || policyErrors.length
      ? "failed"
      : "passed",
  runtimeAcceptance: "NOT_RUN — no production service authorized",
  mediaAcceptance: "NOT_PASSED",
  overallAcceptance: "NOT_PASSED",
};
fs.writeFileSync(
  "reports/draft-artifact-static-results.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      result: report.result,
      routes: rows.length,
      failedRoutes: rows.filter((r) => r.errors.length),
      policyErrors,
      buildId: identity.buildId,
    },
    null,
    2,
  ),
);
if (report.result === "failed") process.exitCode = 1;
