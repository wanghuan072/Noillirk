const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const cases = [
  {
    id: "fermi-safe-form-submit",
    gameId: "fermi",
    testedBuildId: "NzE2M_1b1N11_2CvSWvmp",
    state:
      "Question requests hours of a 60-watt bulb powered by food energy; numeric field initially empty",
    actions: ["Type 2 into Your guess, in hours", "Select Guess"],
    visibleResult: {
      guess: 2,
      answer: 2.07,
      ratio: "1.03× too low",
      accuracy: "Bullseye",
      streak: 1,
    },
    inputResult: "passed",
    recovery:
      "Before allow-forms, Guess remained without judged feedback; with allow-forms, same form path produced a result. Permissions stay provisional pending clean-context retest.",
    version: "Daily unlimited /fermi; NOT fermi.gg",
    spoiler:
      "Do not put the actual prompt answer in cards, introduction, metadata or alt.",
  },
  {
    id: "poople-validation-recovery",
    gameId: "poople",
    testedBuildId: "ql1tD7me_R7KjrPhn4ue0",
    state: "HALO starting word; timer at zero",
    actions: [
      "Enter HALT with visible keyboard and Enter",
      "Enter HELP",
      "Read Change exactly one letter.",
      "Delete HELP, enter HALE and submit",
    ],
    visibleResult: {
      acceptedRungs: ["HALO", "HALT", "HALE"],
      rejected: "HELP",
      clock: "Started after first valid rung; continued during refusal",
    },
    inputResult: "passed",
    version: "Daily Poople Unlimited",
    spoiler:
      "Body worked fragment must be marked before display; no full solution is revealed.",
  },
  {
    id: "size-judgment-and-keyboard",
    gameId: "size-it-up",
    testedBuildId: "ql1tD7me_R7KjrPhn4ue0",
    state: "Five-round run; Adult Tricycle compared with a 61cm cat reference",
    actions: [
      "Lock a 63cm guess",
      "Read real size and ratio",
      "Next round: press ArrowRight on Size of the Impact Driver",
    ],
    visibleResult: {
      realSize: "2m",
      ratio: "3.2× too small",
      points: 7,
      sliderBefore: "0.08837623183413061",
      sliderAfter: "0.09014375647081323",
    },
    inputResult: "passed",
    version: "Daily Size It Up unlimited",
    spoiler:
      "Object answer remains internal; body can discuss ratio without naming the object.",
  },
  {
    id: "color-slider-reveal",
    gameId: "color",
    testedBuildId: "ql1tD7me_R7KjrPhn4ue0",
    state:
      "Easy selected; Ready then five-second target, followed by reconstruction",
    actions: [
      "Start Play easy",
      "Press ArrowRight on Hue",
      "Lock in this color",
    ],
    visibleResult: {
      hueBefore: 266,
      hueAfter: 267,
      pick: "h267 s50 b50",
      target: "h350 s97 b65",
      score: 3.31,
      maximum: 10,
    },
    inputResult: "passed",
    version: "Daily Color Game",
    spoiler: "No specific upcoming target disclosed.",
  },
  {
    id: "logo-slider-reveal",
    gameId: "color-logo",
    testedBuildId: "ql1tD7me_R7KjrPhn4ue0",
    state: "Famous deck; outlined part of Panasonic logo",
    actions: [
      "Start Play Famous",
      "Press ArrowRight on Hue",
      "Lock in this color",
    ],
    visibleResult: {
      hueBefore: 322,
      hueAfter: 323,
      pick: "h323 s77 b73",
      brand: "h214 s100 b67",
      score: 3.26,
      maximum: 10,
    },
    inputResult: "passed",
    version: "Daily Logo Game",
    spoiler:
      "Brand answer stays internal; public description should discuss marked-region selection.",
  },
];
write("research/runtime-case-observations.json", {
  status: "observed-in-shared-context-not-release-qualification",
  method:
    "Live CUA UI actions and read-only frame DOM; structured transcription of observed values",
  observedDate: "2026-10-20",
  recordedAt: new Date().toISOString(),
  cases,
});
const matrix = read("research/game-claim-matrix.json");
matrix.claims = matrix.claims.filter((c) => !cases.some((x) => c.id === x.id));
for (const c of cases)
  matrix.claims.push({
    id: c.id,
    gameId: c.gameId,
    claim: c.visibleResult,
    versionScope: c.version,
    support: ["research/runtime-case-observations.json#" + c.id],
    conflicts: [],
    conclusion:
      "observed-input-and-result; clean-context publication checks pending",
    confidence: "high-for-recorded-state-only",
    publicRestriction: c.spoiler,
    secondaryCheck:
      "Recheck exact final build, isolated context, network, media and per-game device behavior.",
  });
matrix.claims = matrix.claims.filter(
  (c) => c.id !== "fermi-video-version-conflict",
);
matrix.claims.push({
  id: "fermi-video-version-conflict",
  gameId: "fermi",
  claim:
    "The observed UHWWW-7f0ag Fermi segment is fermi.gg, while the current Daily page explicitly distinguishes its own unlimited version.",
  versionScope: "Fermi.gg daily vs Daily unlimited",
  support: [
    "research/video-analysis.json",
    "reports/acceptance-evidence/draft-iframe-observations.json",
    "research/runtime-case-observations.json",
  ],
  conflicts: [
    "A shared game title and ratio feedback are insufficient for version equivalence.",
  ],
  conclusion: "reject-video-for-current-fermi-page",
  confidence: "high",
  publicRestriction:
    "Do not embed or transfer the observed daily scoring to this page.",
  secondaryCheck:
    "Find a current Daily unlimited video or replace the candidate before publication.",
});
write("research/game-claim-matrix.json", matrix);
const video = read("research/video-analysis.json");
const f = video.videos.find(
  (v) => v.gameId === "fermi" && v.videoId === "UHWWW-7f0ag",
);
if (f) {
  f.identity = "different-version";
  f.adoption = "rejected-version-mismatch";
  f.limitations.push(
    "Live Daily help explicitly distinguishes this unlimited implementation from fermi.gg shown in the video.",
  );
}
write("research/video-analysis.json", video);
const map = read("research/keyword-video-map.json");
const fv = map.games
  .find((g) => g.gameId === "fermi")
  ?.candidates.find((v) => v.videoId === "UHWWW-7f0ag");
if (fv) {
  fv.identity = "different-version";
  fv.adoption = "rejected-version-mismatch";
  fv.reason =
    "Observed Fermi.gg daily interface; Daily unlimited explicitly says it is a different implementation.";
}
write("research/keyword-video-map.json", map);
const games = [
  read("data/games/main-game.json"),
  ...read("data/games/games.json"),
];
const blueprint = read("planning/page-content-blueprints.json");
blueprint.status =
  "draft-sections-aligned; game-media-and-video-qualification-open";
for (const g of games) {
  let p = blueprint.pages.find((p) => p.gameId === g.id);
  if (!p) {
    p = { pageId: g.id, gameId: g.id };
    blueprint.pages.push(p);
  }
  p.sections = g.content.map((s) => ({
    id: s.id,
    heading: s.heading,
    playerTask: s.heading,
    claimIds: [
      g.id === "noillirk" ? "noillirk-scoring" : g.id + "-loop",
      ...cases.filter((c) => c.gameId === g.id).map((c) => c.id),
    ],
    caseIds: cases
      .filter(
        (c) =>
          c.gameId === g.id &&
          ((g.id === "fermi" && s.id === "read-ratio") ||
            (g.id === "poople" && s.id === "one-position") ||
            (g.id === "size-it-up" &&
              ["interpret-the-reveal", "adjust-deliberately"].includes(s.id)) ||
            (g.id === "color" &&
              ["rebuild-with-controls", "learn-from-comparison"].includes(
                s.id,
              ))),
      )
      .map((c) => c.id),
    screenshots: {
      status: "not_adopted",
      task: "Show current " + g.title + " state relevant to " + s.heading,
    },
    video: {
      status: "not_adopted",
      reason:
        "Exact-version segmented playback and embed qualification remain open",
    },
  }));
}
write("planning/page-content-blueprints.json", blueprint);
const record = read("reports/player-runtime-results.json");
record.status =
  "partial-shared-context-observations; no released game qualified";
record.cleanBrowserContext = false;
record.latestCompiledBuildId = fs
  .readFileSync(".next-preview/BUILD_ID", "utf8")
  .trim();
const baseline = read(
  "reports/acceptance-evidence/draft-iframe-observations.json",
);
for (const g of games.slice(1)) {
  let r = record.games.find((r) => r.gameId === g.id);
  if (!r) {
    r = { gameId: g.id };
    record.games.push(r);
  }
  const b = baseline.observations.find((x) => x.gameId === g.id);
  Object.assign(r, {
    configuredIframeSrc: g.player.iframeSrc,
    actualFrameUrl: b?.actualFrameUrl || null,
    finalOrigin: b?.actualFrameUrl ? new URL(b.actualFrameUrl).origin : null,
    launchSteps: [
      "Navigate to isolated local draft route",
      "Play Now creates one configured iframe",
      "Read current frame title and controls",
    ],
    visibleIdentity: b?.visibleTitle || null,
    popupAttempts: "not_observed; not comprehensively instrumented",
    topNavigationAttempts: "not_observed; not comprehensively instrumented",
    sandbox: g.player.sandbox,
    networkErrors: [],
    networkObservation:
      "No full frame-network audit; empty list is not a network pass",
    testedBuildId: b ? baseline.buildId : null,
    result: "unverified",
    evidence: "reports/acceptance-evidence/draft-iframe-observations.json",
  });
  const c = cases.find((c) => c.gameId === g.id);
  r.inputTest = c
    ? {
        result: "passed-in-shared-context",
        caseId: c.id,
        testedBuildId: c.testedBuildId,
        evidence: "research/runtime-case-observations.json",
      }
    : {
        result: ["krillion", "maptap", "word-hunt"].includes(g.id)
          ? "attempted-no-accepted-core-result"
          : "not_run",
        notes: "Not eligible for publication.",
      };
  if (c) r.result = "effective-input-observed-publication-unverified";
}
record.remainingGameIds = [];
record.remainingStatus =
  "All eight opened for identity observation; clean-context final-build qualification remains open for every additional game.";
write("reports/player-runtime-results.json", record);
