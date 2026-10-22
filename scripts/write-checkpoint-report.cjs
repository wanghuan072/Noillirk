const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) =>
  fs.writeFileSync(
    p,
    typeof v === "string" ? v : JSON.stringify(v, null, 2) + "\n",
  );
const now = new Date().toISOString(),
  buildId = fs.readFileSync(".next-preview/BUILD_ID", "utf8").trim();
const base = "reports/acceptance-evidence/" + buildId;
const render = read(base + "/route-checks.json"),
  http = read("reports/preview-http-results.json"),
  commands = read("reports/command-results.json");
if (render.buildId !== buildId || http.buildId !== buildId)
  throw new Error("Current-build evidence missing");
const main = read("data/games/main-game.json"),
  additional = read("data/games/games.json"),
  games = [main, ...additional];
if (typeof main.player.iframeSrc !== "string" || !main.player.iframeSrc)
  throw new Error("Main player configuration missing");
const guides = fs
  .readdirSync("data/guides")
  .filter((f) => f.endsWith(".json"))
  .map((f) => read("data/guides/" + f));
const cases = read("research/runtime-case-observations.json").cases;
const candidates = read("research/additional-game-candidates.json");
const ledger = read("research/media-ledger.json"),
  seo = read("reports/seo-field-checks.json");
const lastTest = commands.commands.findLast((c) => c.testStats),
  dev = read("reports/dev-runtime-results.json");
const control = read(base + "/player-controls.json");
const bodyRows = render.rows.filter((r) => r.viewport[0] === 1536 && r.gameId);
const issueByRequirement = {
  1: "Workflow documents read; the full 01–10 acceptance gates are not complete.",
  2: "User override permits downstream draft work; no incomplete stage is relabelled completed.",
  3: "Outputs kept inside the project; workflow/skills/framework docs read without reading other game projects.",
  4: "Three shared base entries implemented; no topic approved.",
  5: "Two substantial Guide JSON drafts exist; neither is published.",
  6: "Seventeen candidates researched; zero fully publication-qualified. Original main URL retained.",
  7: "Controls implemented and current main load/retry observed; required game covers and complete failure/timeout/system-Esc tests pending.",
  8: "All nine have separate article data after the player; iframe text is not used as site body.",
  9: "Five game pages exceed the visible character floor; four remain short. Full research/media quality acceptance remains open.",
  10: "Draft geometry and bounded sidebar observed; real-cover heights and adopted video alignment require retest.",
  11: "Draft groups have the required inventory counts; published flags and final relevance are not qualified.",
  12: "English/international market, existing Next/React/npm and portable Node standalone chosen in project records.",
  13: "Research, code and local checks ran; complete candidate/video/media work remains open.",
  14: "Zero game covers/captures/videos adopted. Main rights unresolved; no unrelated or uncertain image used.",
  15: "Original local PNG logo and restrained H1 styles implemented; final game-media design audit pending.",
  16: "Five root Legal pages and Footer grouping implemented; no forms or invented organization.",
  17: "All eighteen data TDK sets meet required lengths; final published-route SEO acceptance remains open.",
  18: "Data-driven canonical/JSON-LD/social and fingerprint checks prepared; final published sitemap/dependency matrix is incomplete.",
  19: "54 current draft route/viewport checks show no overflow; final media contexts remain untested.",
  20: "Original player-oriented drafts and no own third-party anchors; complete editorial review remains open.",
  21: "English player README includes all base navigation and Legal links plus both Guide links.",
  22: "No deployment, Git commit or external consultation performed.",
  23: "Stable IDs and own player/body identity observed; missing covers prevent full one-to-one media acceptance.",
  24: "Main is provisional: current configured source and actual frame match; retry has one frame. Unsafe/timeout UI fixtures remain untested.",
  25: "Development 23 routes and production-mode draft 18 routes checked; first-party runtime clean after Suspense fix. Third-party gameplay/network qualification remains incomplete.",
  26: "Queries, claims, sampled video observations and actual cases linked; complete per-game evidence chains not accepted.",
  27: "Overall NOT ACCEPTED; no approved deployable release, no formal-domain online acceptance.",
  28: "No unrelated stock hero or uncertain game image adopted; required original-cover context checks are impossible without adopted covers.",
  29: "Three online references documented; real-game-cover high-fidelity gate remains open.",
  30: "Guide head/order, no invented byline and responsive TOC implemented; final long-scroll/accessibility completion pending.",
  31: "Capability record and conditional Legal copy prepared; no first-party accounts/forms/analytics/payments/comments enabled.",
  32: "Draft manifest, screenshots and contact sheet exist; required game-media and Lighthouse evidence absent.",
  33: "Two independent Guide briefs, original distinct diagrams and stable JSON routes exist; publication/media approval pending.",
  34: "Commands/services recorded separately with real exit values. Old interrupted-service exit values are not fabricated; final process closure documented separately.",
  35: "Current main → Fermi → back clears frames/fullscreen and restores ready state; broader error/fullscreen lifecycle matrix remains open.",
  36: "Mobile/Desktop Lighthouse NOT RUN on a qualified final media surface; no scores or performance pass claimed.",
};
const manifest = [];
const add = (
  id,
  route,
  contentId,
  viewport,
  method,
  evidence,
  result,
  issue,
  fixFiles = [],
) =>
  manifest.push({
    requirementId: "R" + String(id).padStart(2, "0"),
    route,
    contentId,
    viewport,
    method,
    evidencePaths: evidence.filter((p) => fs.existsSync(p)),
    firstResult: result,
    issue,
    fixFiles,
    retestResult: result,
    checkedAt: now,
    scope: "local draft; never a release approval",
  });
for (let id = 1; id <= 36; id++)
  add(
    id,
    "*",
    null,
    null,
    "Document/data/code/command review",
    [
      "project.yaml",
      "handoff/flow-01-brief.md",
      "reports/command-results.json",
      "reports/validation-release.json",
    ],
    [3, 12, 21, 22].includes(id)
      ? "passed-scoped"
      : id === 36
        ? "not_run"
        : "partial",
    issueByRequirement[id],
  );
for (const g of games) {
  const route = g.id === main.id ? "/" : "/games/" + g.slug,
    row = bodyRows.find((r) => r.gameId === g.id);
  const dataPath =
    g.id === main.id ? "data/games/main-game.json" : "data/games/games.json";
  add(
    9,
    route,
    g.id,
    [1536, 900],
    "Rendered article.innerText, whitespace removed; excludes cards and closed FAQ answers",
    [base + "/route-checks.json", dataPath],
    row?.bodyCharacters >= 4000 ? "passed-count-only" : "failed",
    (row?.bodyCharacters || 0) +
      " visible non-whitespace characters; count does not pass research or media quality.",
    ["data/games/games.json"],
  );
  add(
    14,
    route,
    g.id,
    null,
    "Game JSON compared with adoption ledger",
    [dataPath, "research/media-ledger.json"],
    "failed",
    "Cover absent; three current-game captures absent; no qualified adopted YouTube video.",
  );
  add(
    23,
    route,
    g.id,
    null,
    "Stable ID, body ID, title and configured iframe trace",
    [
      base + "/route-checks.json",
      "reports/player-runtime-results.json",
      dataPath,
    ],
    "partial",
    "Data identity is scoped; current game cover and full clean-context runtime not qualified.",
  );
  add(
    26,
    route,
    g.id,
    null,
    "Question/claim/case/section/media cross-reference",
    [
      "research/keyword-video-map.json",
      "research/game-claim-matrix.json",
      "research/video-analysis.json",
      "planning/page-content-blueprints.json",
    ],
    "partial",
    "Important media and version/input observations remain open; no complete evidence-chain acceptance.",
  );
}
for (const row of render.rows) {
  const route = row.route.replace(/^\/preview(?=\/|$)/, "") || "/";
  add(
    19,
    route,
    row.gameId || route,
    row.viewport,
    "CUA screenshot and live DOM geometry",
    [row.evidencePath, base + "/route-checks.json"],
    "passed-draft-geometry",
    "No horizontal overflow; required final game covers absent, so media/layout acceptance remains open.",
  );
  add(
    25,
    route,
    row.gameId || route,
    row.viewport,
    "CUA DOM plus CDP runtime/network event capture",
    [base + "/route-runtime-events.json", row.evidencePath],
    "passed-first-party-draft",
    "No captured first-party errors; this does not qualify third-party game input/network.",
  );
}
const { selectGames } = require("../lib/recommendations.ts");
for (const g of games) {
  const route = g.id === main.id ? "/" : "/games/" + g.slug,
    selection = selectGames(g, additional, g.id === main.id);
  add(
    7,
    route,
    g.id,
    [1536, 900],
    "Initial rendered controls plus configured player data",
    [
      base + "/route-checks.json",
      "data/games/main-game.json",
      "data/games/games.json",
    ],
    "partial",
    "Zero initial frames and one Play Now observed; mandatory current-game cover is absent.",
  );
  add(
    11,
    route,
    g.id,
    null,
    "Same selector used by renderer and fingerprint payloads",
    ["lib/recommendations.ts", "data/games/games.json"],
    "partial",
    `Draft counts ${selection.featured.length}/${selection.newest.length}/${selection.recommended.length}; published inventory and final relevance/cross-group curation remain unqualified.`,
  );
}
for (const item of seo.items) {
  const g = additional.find((g) => g.id === item.id),
    guide = guides.find((g) => g.id === item.id);
  const route =
    item.id === "home"
      ? "/"
      : g
        ? "/games/" + g.slug
        : guide
          ? "/guides/" + guide.slug
          : "/" + item.id;
  add(
    17,
    route,
    item.id,
    null,
    "Unicode data-field character counts",
    ["reports/seo-field-checks.json"],
    item.result === "passed" ? "passed-data-fields" : "failed",
    `title ${item.titleLength}; description ${item.descriptionLength}; not final published-route metadata acceptance.`,
  );
}
for (const route of ["/privacy", "/terms", "/copyright", "/about", "/contact"])
  add(
    16,
    route,
    route.slice(1),
    null,
    "Current-build HTTP plus shared Legal renderer",
    ["reports/preview-http-results.json", "data/site/legal.json"],
    "passed-local-root",
    "Local root returns 200; live formal-origin acceptance not performed.",
  );
const brokenDev = commands.commands.find(
  (c) =>
    c.mode === "development" &&
    fs.existsSync(c.logPath) &&
    fs.readFileSync(c.logPath, "utf8").includes("Error: Route"),
);
if (brokenDev) {
  add(
    25,
    "/preview/*; public utility routes",
    "dynamic-router",
    null,
    "Server log before fix; 23-route development retest",
    [brokenDev.logPath, "reports/dev-runtime-results.json", dev.serverLogPath],
    "failed",
    "Async URL data was outside Suspense.",
    ["app/preview/[[...segments]]/page.tsx", "app/[...segments]/page.tsx"],
  );
  manifest.at(-1).retestResult =
    dev.serverErrors.length === 0 ? "passed-development-scope" : "failed";
}
write("reports/acceptance-manifest.json", {
  status: "NOT_ACCEPTED",
  buildId,
  generatedAt: now,
  mainIframeStatus: "provisional",
  mediaAcceptance: "NOT_PASSED",
  overallDelivery: "NOT_PASSED",
  productionDomainOnlineAcceptance: "NOT_RUN",
  lighthouse: "NOT_RUN",
  items: manifest,
});
const runtime = read("reports/player-runtime-results.json");
runtime.latestCompiledBuildId = buildId;
runtime.currentMainControlEvidence = base + "/player-controls.json";
const m = runtime.games.find((g) => g.gameId === main.id);
Object.assign(m, {
  testedBuildId: buildId,
  configuredIframeSrc: main.player.iframeSrc,
  actualFrameUrl: control.main.url,
  finalOrigin: new URL(control.main.url).origin,
  result: "provisional",
  inputTest: { result: "not_run", notes: "No accepted main answer claimed" },
  evidence: base + "/player-controls.json",
});
write("reports/player-runtime-results.json", runtime);
const gameTable = bodyRows
  .map((r) => `| ${r.gameId} | ${r.bodyCharacters} | draft |`)
  .join("\n");
const report = `# Research and local-build checkpoint\n\nOverall status: **NOT ACCEPTED**. Media acceptance: **NOT PASSED**. This is an isolated noindex draft, not an approved deployable website. No deployment or Git commit was performed.\n\n## Research and implementation\n\n${candidates.candidates.length} additional candidates have profiles. Eight implementation targets remain provisional, with zero fully qualified publication candidates. Eight task-specific YouTube native searches supplemented web research. The observed Fermi.gg video was rejected for the current Daily Fermi implementation. Five additional games have observed effective input/results in a shared context; none is clean-context release-qualified. Main iframe remains **provisional** and exactly \`${main.player.iframeSrc}\`.\n\nGame media rights remain unresolved. No unconfirmed game picture was downloaded/adopted as a site asset. The ${ledger.items.length} adopted files are wholly original site/Guide designs; Guide diagrams do not count as real game captures.\n\nExisting Next 16.4.2/React 19.3/npm preserved. Game/Guide data, navigation, player, sidebar, Legal pages and SEO renderers implemented. Fermi needed allow-forms for submission. Unknown routes now return true 404 responses through a data-generated route guard. Async route resolution moved into Suspense to remove development navigation-validation errors.\n\n## Actual checks\n\nCurrent local build: \`${buildId}\`; standalone source: \`.next-preview/standalone\`. Production-mode preview binds 127.0.0.1:4318; development uses 127.0.0.1:4319 and separate .next-dev output.\n\n- Local draft production compilation: exit 0, including framework TypeScript/prerender checks.\n- Lint and standalone type check: exit 0. Node tests: ${lastTest.testStats.pass}/${lastTest.testStats.tests}, machine counted from TAP.\n- ${http.counts.routes} HTTP route checks and ${http.counts.assets} static-asset checks: ${http.counts.failed} failures. Includes five Legal root paths and rejected duplicate/internal paths.\n- ${render.rows.length} current-build screenshots/geometry checks at 1536, 1024 and 768 widths; no horizontal overflow or captured first-party runtime errors.\n- Development: ${dev.rows.length} page checks; ${dev.serverErrors.length} server-error lines after repair; browser events recorded separately. Earlier failure logs are retained.\n- TDK fields: ${seo.items.length} sets pass 40–60/140–160 lengths. Preview has noindex; no final published canonical/sitemap acceptance claimed.\n- Data fingerprints preserve unchanged dates. Actual Terms/Copyright edits caused the read-only check to fail only those pages before explicit update. Full published Game/Guide controlled dependency tests remain pending.\n- npm production dependency audit: zero vulnerabilities. Full development audit: five high advisories in the ESLint/glob chain; no forced framework downgrade applied.\n\nCurrent main controls create exactly one configured iframe, retry to one frame, and cleanly navigate to Fermi/back into ready state. Both fullscreen graphics differ. Native entry/visible exit and mode switching were observed; system-Esc and injected timeout/unsafe-address UI scenarios remain unverified. Main gameplay itself is not claimed verified.\n\n## Visible body counts\n\nMeasured after player/recommendations, using article.innerText, without card text, image alt/captions, video modules or closed FAQ answers. A character-floor pass is not a content-quality pass.\n\n| Game ID | Visible characters | Publication |\n|---|---:|---|\n${gameTable}\n\n## Remaining publication work\n\n- Confirm an applicable use basis for the main cover and real captures; apply the same media standard to every additional candidate. No external consultation is authorized.\n- Replace unsuitable video/candidate leads and qualify at least eight additional games with current-version videos, complete real-game interaction, safe sandbox and clean contexts.\n- Complete short game bodies with verified unique facts/cases; finish Guide/Game evidence chains and final media alignment. Do not pad to the floor.\n- Complete cover-context/high-fidelity/contact evidence, final media-aware sidebar checks, all player failure/accessibility scenarios and the published sitemap/date matrix.\n- Run Mobile/Desktop Lighthouse on the qualified final production surface, retaining raw metrics and medians when needed. No Lighthouse score or performance pass exists now.\n\n## Reproduce the local draft\n\nNode 24.19.0 was used. From this project, run \`npm run build:preview\`, then \`npm run preview\`; open http://127.0.0.1:4318/preview. Run \`npm run dev\` for the isolated loopback development mode. \`npm run build\` deliberately refuses unqualified records before compilation. To refresh dates after reviewed visible changes, use \`npm run dates:update\`; ordinary builds only check.\n\nStop only recorded workflow-owned listeners after matching their command/PID/port. Service termination is not a passing build/test. See command-results.json, owned-service-stop-evidence.json and process-closure.json. Formal origin is configured as https://noillirk.me; its live deployment has not been accepted or deployed by this workflow.\n`;
write("reports/continuation-checkpoint.md", report);
write("reports/flow-06-build-report.md", report);
write(
  "reports/flow-09-seo-report.md",
  `# SEO checkpoint\n\nPartial, not release accepted. ${seo.items.length} TDK field sets pass length checks. Static values live in seo/tdk.js; home reads main JSON, game/Guide details use their own JSON. Shared breadcrumb data drives visible crumbs and JSON-LD. All social images use /images/og-image.png. Draft pages are noindex, omitted from local sitemap, and never treated as published.\n\nSeven current static/list data fingerprints are prepared; recommendation selections use the same selector as rendering. Date-only advancement retains hashes/dates. Terms/Copyright change detection was demonstrated before explicit update. Full published content/media dependency tests, final origin-path checks and sitemap output remain pending because there are zero published games/Guides.\n\nSee continuation-checkpoint.md and acceptance-manifest.json.\n`,
);
write("reports/flow-10-acceptance-report.md", report);
write(
  "handoff/flow-02-brief.md",
  `# Flow 02 handoff\n\nStatus: in_progress; qualification gate NOT passed. The explicit user override allows draft planning/development/local builds while main-media rights remain unresolved. It does not approve media or overall delivery.\n\nInputs remain Noillirk, noillirk.me and exact main iframe https://playdaily.org/noillirk. English/international market; no approved topics. ${candidates.candidates.length} candidate profiles, eight independent native video searches, sampled video observations, source/version conflicts and five effective shared-context input cases are recorded. Fermi.gg is a different implementation from the current Daily Fermi; that observed segment is rejected. Zero publication-qualified additional games and zero adopted game videos/images.\n\nCurrent downstream drafts: shared site/player, two Guide JSON articles with distinct original diagrams, eight game detail drafts, root Legal pages and SEO. Technical local checks may pass in their limited scope; stage 02/media/final release gates remain open. No generic replacement image or unsupported long filler is allowed.\n\nNext work: qualify suitable candidate versions and videos, complete unsupported short pages or replace them, and resolve actual image-use evidence before adoption. Existing applicable permission for main artwork may be supplied later; do not contact external parties or repeat approval questions. Preserve the original iframe, no deployment/Git commit. Read continuation-checkpoint.md for actual current state.\n`,
);
write(
  "handoff/flow-09-brief.md",
  `# Flow 09 handoff\n\nPartial: TDK/metadata/breadcrumb/structured-data renderers and public-data date checks implemented. Final published inventories, media and comprehensive date/dependency acceptance remain open. No indexable draft, no canonical duplicate main detail and no claimed online origin acceptance. Continue with the explicit user override; never convert local compile success into media or final delivery approval.\n`,
);
write(
  "handoff/flow-10-final-brief.md",
  `# Flow 10 checkpoint — NOT final acceptance\n\nStatus: in_progress / NOT_ACCEPTED. Latest compiled draft ${buildId}. Main iframe provisional. Media acceptance and overall delivery not passed. No deployment or Git commit.\n\nRead reports/continuation-checkpoint.md, reports/acceptance-manifest.json, command-results.json and player-runtime-results.json. Final eligible additional inventory is zero, not eight. Four game articles remain below the character floor; all mandatory game media/video qualification is open. Local technical evidence must not be represented as a production release.\n`,
);
write("planning/workflow-status.json", {
  updatedAt: now,
  userOverride:
    "Continue research/planning/development/local builds; no uncertain-image adoption or media/overall pass",
  stages: [
    { id: 1, status: "completed" },
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => ({
      id,
      status: id === 8 ? "media_pending" : "in_progress",
      localDraftWorkPermitted: true,
    })),
  ],
  mainIframe: "provisional",
  media: "NOT_PASSED",
  delivery: "NOT_PASSED",
});
const gc = read("planning/guide-coverage.json");
for (const item of gc.items) item.coverage_status = "draft";
write("planning/guide-coverage.json", gc);
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
write(
  "reports/acceptance-evidence/draft-contact-sheet.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><title>Draft evidence — not media accepted</title><style>body{font:15px system-ui;background:#f6f4ec;color:#123c3b;margin:24px}main{max-width:1400px;margin:auto}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}img{width:100%;height:auto}figure{margin:0;border:1px solid #bccbc6;padding:12px}a{color:#123c3b}</style><main><h1>Local draft evidence</h1><p>Build ' +
    esc(buildId) +
    '. Covers/captures/videos are not accepted. These views deliberately omit unadopted game images; they do not prove the missing media contexts.</p><div class="grid">' +
    render.rows
      .map(
        (r) =>
          "<figure><figcaption>" +
          esc(r.route) +
          " · " +
          r.viewport.join("×") +
          '</figcaption><a href="' +
          esc(r.evidencePath.replace("reports/acceptance-evidence/", "")) +
          '"><img loading="lazy" src="' +
          esc(r.evidencePath.replace("reports/acceptance-evidence/", "")) +
          '" alt="' +
          esc(r.route) +
          ' local draft"></a></figure>',
      )
      .join("") +
    "</div></main></html>",
);
console.log(
  JSON.stringify({
    buildId,
    status: "NOT_ACCEPTED",
    manifestItems: manifest.length,
    routeScreenshots: render.rows.length,
    guides: guides.length,
    observedInputCases: cases.length,
  }),
);
