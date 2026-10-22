const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const date = "2026-10-22";
const evidence = [
  {
    id: "daily-rules-20261022",
    url: "https://playdaily.org/noillirk",
    checkedAt: date,
    use: "15-second clock, six tiers, refusal, Endless balloons. Images not adopted.",
  },
  {
    id: "daily-howto-20261022",
    url: "https://playdaily.org/resources/stories/how-to-play-noillirk",
    checkedAt: date,
    use: "Mode selection, Begin ascent, Enter/Climb, accepted round ends, retry while time remains, recovery cap. No copied prose or images.",
  },
  {
    id: "daily-tips-20261022",
    url: "https://playdaily.org/resources/stories/how-to-get-better-at-noillirk",
    checkedAt: date,
    use: "Board boundaries and answer form. Omit historical zone counts, altitude conversion and absolute joke claims because texts conflict.",
  },
  {
    id: "daily-mode-20261022",
    url: "https://playdaily.org/resources/stories/noillirk-daily-climb",
    checkedAt: date,
    use: "Daily one attempt versus Classic practice. No live Daily answers reproduced.",
  },
];
const briefs = read("research/guide-content-briefs.json");
const blueprints = read("planning/page-content-blueprints.json");
const cases = {
  "noillirk-answer-strategy": [
    {
      id: "beach-category",
      type: "original-practice",
      detail:
        "Compare carried object towel with weather adjective sunny, then change take to wear. Not a real board or guaranteed acceptance.",
    },
    {
      id: "drawer-familiarity",
      type: "original-practice",
      detail:
        "Compare broad everyday object, specialist tool and household-specific association without predicting scores.",
    },
    {
      id: "refusal-recovery",
      type: "rule-application",
      detail:
        "Refusal with active timer versus accepted low result versus completed miss require different next actions.",
    },
  ],
  "noillirk-scoring-and-endless": [
    {
      id: "equal-224",
      type: "worked-arithmetic",
      detail:
        "7*32 = 224 and 100+64+32+16+8+4+0 = 224; diagnose different decision patterns. Not a recorded run.",
    },
    {
      id: "last-balloon",
      type: "rule-application",
      detail:
        "At one balloon, accepted Grounded leaves one; miss ends; Sky High restores to two.",
    },
    {
      id: "recovery-sequence",
      type: "hypothetical-state-sequence",
      detail:
        "3 with Grounded stays 3; miss ->2; Kite stays2; SkyHigh ->3; anotherSkyHigh stays3.",
    },
  ],
};
for (const brief of briefs.guides) {
  const guide = read(`data/guides/${brief.guide_id}.json`);
  brief.version =
    "Daily balloon-climb edition; published rule pages rechecked 2026-10-22";
  brief.steps = guide.sections.map((s) => s.id);
  brief.cases = cases[guide.id];
  brief.evidence_ids = evidence.map((e) => e.id);
  brief.mediaTask =
    "One unique task cover plus two unique explanatory body diagrams; original vector geometry, not game screenshots.";
  brief.content_status =
    "rewritten-with-cases-and-diagrams; publication and production acceptance pending";
  brief.unsupported_claims = [
    "Any illustrative word guaranteed acceptance or rank",
    "Practice scorecards presented as real sessions",
    "Constant metres-per-point formula",
    "Unverified cross-device recovery",
    "Third-party screenshot reuse rights",
    "Unwatched video treated as supporting evidence",
  ];
  const page = blueprints.pages.find((p) => p.guideId === guide.id);
  page.version = brief.version;
  page.claims = [
    "daily-response-rules-20261022",
    "daily-scoring-and-balloons-20261022",
  ];
  page.sections = guide.sections.map((s) => ({
    id: s.id,
    heading: s.title,
    playerTask: s.title,
    claimIds: page.claims,
    caseIds: cases[guide.id].map((c) => c.id),
    images: s.blocks
      .filter((b) => b.type === "image")
      .map((b) => ({
        src: b.src,
        role: b.caption,
        provenance: "project-original explanatory diagram",
      })),
    video: {
      status: "not-adopted",
      reason:
        "No exact-version watched, embedded candidate qualifies; Guide remains complete without a video block, main-game mandatory video remains open.",
    },
    exclusions: brief.unsupported_claims,
  }));
}
briefs.status =
  "two-independent-guides-rewritten-primary-rules-and-original-exercises";
briefs.revisionEvidence = evidence;
write("research/guide-content-briefs.json", briefs);
write("planning/page-content-blueprints.json", blueprints);
const claims = read("research/game-claim-matrix.json");
for (const claim of [
  {
    id: "daily-response-rules-20261022",
    gameId: "noillirk",
    claim:
      "Daily current rules describe one response, Enter/Climb submission, 15 seconds, refused entry can be replaced while active. Accepted result ends prompt.",
    versionScope: "Daily only, checked 2026-10-22",
    support: evidence.map((e) => e.id),
    conflicts: [
      "Independent same-name editions use different clocks and scoring.",
    ],
    conclusion: "primary-rule-backed, no new main-game playable assertion",
    confidence: "high",
    publicRestriction:
      "Invented practice examples are not live answers; do not guarantee acceptance or rank.",
  },
  {
    id: "daily-scoring-and-balloons-20261022",
    gameId: "noillirk",
    claim:
      "Six values4,8,16,32,64,100; seven perfect results700; Endless accepts preserve, misses remove, SkyHigh restores up to3.",
    versionScope: "Daily only, checked 2026-10-22",
    support: evidence.map((e) => e.id),
    conflicts: [
      "Official article says ten metres per point while also saying700points14km. Older tips says52zones while landing says69. No constant altitude conversion or zone enumeration included.",
    ],
    conclusion: "tier/life rules agree; altitude formula omitted as unresolved",
    confidence: "high for tier/life rules; unresolved for altitude conversion",
    publicRestriction:
      "Do not claim scorecard examples or balloon branches are recorded sessions.",
  },
]) {
  const i = claims.claims.findIndex((c) => c.id === claim.id);
  if (i < 0) claims.claims.push(claim);
  else claims.claims[i] = claim;
}
claims.guideRevisionEvidence = evidence;
write("research/game-claim-matrix.json", claims);
const map = read("research/keyword-video-map.json");
const main = map.games.find((g) => g.gameId === "noillirk");
main.queries.push({
  query:
    "site:youtube.com/watch Noillirk Daily Classic climb balloons playdaily",
  task: "Recheck exact-version visual evidence for the two Guide tasks and mandatory main-game video",
  entry: "web-search",
  checkedAt: date,
  resultScope:
    "No qualifying exact-version playable candidate surfaced in this query; unrelated YouTube help/artist pages rejected. No new video adopted or claimed watched.",
});
main.guideTasks = briefs.guides.map((g) => ({
  id: g.guide_id,
  task: g.task,
  questions: g.questions,
  evidence: evidence.map((e) => e.id),
}));
write("research/keyword-video-map.json", map);
const slots = read("planning/media-slots.json");
for (const m of read("research/media-ledger.json").items.filter((m) =>
  m.originalLocation?.startsWith("design/guides/"),
)) {
  const slot = {
    slot_id: m.id,
    page_id: m.usedOn[0].split("/").pop(),
    preferred_format: "original-explanatory-visual",
    rights_check_needed: false,
    status: "adopted",
    localPath: m.localPath,
    purpose: m.semanticPurpose,
  };
  const i = slots.slots.findIndex((s) => s.slot_id === slot.slot_id);
  if (i < 0) slots.slots.push(slot);
  else slots.slots[i] = slot;
}
write("planning/media-slots.json", slots);
write("research/guide-revision-facts-20261022.json", {
  checkedAt: date,
  primaryEvidence: evidence,
  originalCases: cases,
  adoptedGameArtwork: false,
  mainIframeUnchanged: "https://playdaily.org/noillirk",
  mediaAcceptance: "NOT_PASSED",
  overallDelivery: "NOT_PASSED",
});
console.log(
  "Guide claims, briefs, page blueprints, media slots and query records updated.",
);
