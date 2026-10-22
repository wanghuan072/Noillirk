import fs from "node:fs";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const now = new Date().toISOString();
const evidence = "reports/acceptance-evidence/additional-review-20261021/";
const runtime = read(evidence + "runtime-observations.json").rows;
const searches = read(evidence + "youtube-searches.json").rows;
const additions = read("data/games/games.json");
const caseText = {
  krillion: [
    "category-boundary",
    "An accepted answer can still earn a common tier. In a fried-food round, tempura earned eight points and moved the dive eighty metres. That result separates two decisions: the food fitted the prompt, but the game did not judge it especially unusual. A refusal would have left the answer task unfinished; this result instead ended the prompt with a modest contribution. Do not treat one verdict as a guaranteed tier for another wording or a future run.",
  ],
  fermi: [
    "read-ratio",
    "A result more than thirty times too high ends a run even when the typed number is accepted by the form. The useful feedback is the direction and the factor: the estimate needs to shrink by a large ratio, not by a few units. Read the answer and explanation before starting another run. A completed wrong guess is different from a field that never submits, and repeatedly pressing Guess cannot revise a result that has already been judged.",
  ],
  poople: [
    "one-position",
    "HEAL to HEAP is a legal example of a small change: H, E and A stay in their positions while L becomes P. After submitting HEAP, a new empty row is ready for the next word. That extra row matters because four visible letters can also be an unsubmitted draft. Check that the rung joined the ladder before planning another move. This example demonstrates a valid step, not a complete route to POOP or a promise that it is the shortest route for your starting word.",
  ],
  "size-it-up": [
    "interpret-the-reveal",
    "A reveal can show a reasonably close estimate without awarding a perfect result. One guess ten percent below the measured length returned ninety-four percent for that round. Read the dashed guess and the measured outline together: the direction of the mismatch tells you whether to enlarge or shrink your next mental estimate. That single result does not establish a universal points formula, and it does not remove the need to check which dimension the reference actually labels.",
  ],
  color: [
    "learn-from-comparison",
    "Changing a slider and locking it in leads to a comparison, not another memory exposure. A reconstruction at h80 s51 b50 against h334 s57 b71 earned 1.01 out of ten. The hue family was the major visible mismatch, with brightness also lower than the target; a small saturation adjustment could not repair it. Use a comparison like this to choose which property to attend to on the next color. The example explains a completed round rather than a target you should copy into another one.",
  ],
  "color-logo": [
    "memory-before-comparison",
    "A remembered logo color can be wrong at the hue-family level. A Famous-deck Discord reconstruction at h102 s57 b65 received 0.78 out of ten beside the brand blue at h235 s64 b95. The comparison makes the error clearer than the low score alone: tuning the green shade more carefully would still miss the blue family. On the next logo, decide the broad hue first and then refine strength and lightness. Brand familiarity gives you a starting idea, not a guarantee that the first slider setting is close.",
  ],
  maptap: [
    "distance-hypothesis",
    "A point on the globe is a completed geographical guess once the distance panel appears. A Yangon round returned Off Target at 9,065 km with zero added points, then offered Next. That is a large placement error, not an unfinished loading state. Reconsider the country and continent before refining the city: a more precise point within the wrong broad region cannot repair a mistake of thousands of kilometres. Let the result settle before advancing, since the outgoing distance panel can briefly remain during the next location transition.",
  ],
  "word-hunt": [
    "observed-word-paths",
    "A short valid path can include a diagonal. On a board with S beside U and N diagonally above that U, pressing S, moving to U, then moving to N displayed SUN with a possible hundred points. Releasing the pointer committed the word: the total became 100 and SUN appeared in the found-word list. Keep the preview and the committed total separate. Seeing letters highlighted during a drag is not yet proof that the word has been banked.",
  ],
};
const cases = read("research/runtime-case-observations.json");
cases.cases = cases.cases.filter(
  (c) => !c.id.startsWith("additional-dev-20261021-"),
);
for (const g of additions) {
  const observed = runtime.find((r) => r.gameId === g.id);
  const [sectionId, text] = caseText[g.id];
  const section = g.content.find((s) => s.id === sectionId);
  if (!section.blocks.some((b) => b.type === "paragraph" && b.text === text))
    section.blocks.push({ type: "paragraph", text });
  cases.cases.push({
    id: "additional-dev-20261021-" + g.id,
    gameId: g.id,
    scope:
      "Current local development site iframe; shared context, not final production acceptance",
    evidence: evidence + "runtime-observations.json",
    state: observed.visibleIdentity,
    actions: observed.actions,
    result: observed.visibleResult,
    inputResult: observed.inputResult,
    limitations: [
      "No complete startup/network or clean-context production qualification",
      "Internal screenshots are not adopted public media",
    ],
  });
}
write("data/games/games.json", additions);
write("research/runtime-case-observations.json", cases);

const claims = read("research/game-claim-matrix.json");
claims.claims = claims.claims.filter(
  (c) => !c.id.startsWith("additional-dev-20261021-"),
);
for (const g of additions)
  claims.claims.push({
    id: "additional-dev-20261021-" + g.id,
    gameId: g.id,
    claim: caseText[g.id][1],
    versionScope:
      "Configured Daily implementation, development observations 2026-10-21",
    support: ["additional-dev-20261021-" + g.id],
    conflicts: [],
    conclusion: "scoped-observation-not-general-formula",
    confidence: "high-for-observed-result-only",
    publicRestriction:
      "No future answer tier, hidden scoring formula, touch support or production qualification inferred.",
  });
write("research/game-claim-matrix.json", claims);
const blueprints = read("planning/page-content-blueprints.json");
for (const page of blueprints.pages) {
  if (!caseText[page.gameId]) continue;
  const section = page.sections.find((s) => s.id === caseText[page.gameId][0]);
  if (section) {
    section.caseIds = [
      ...new Set([
        ...(section.caseIds || []),
        "additional-dev-20261021-" + page.gameId,
      ]),
    ];
    section.claimIds = [
      ...new Set([
        ...(section.claimIds || []),
        "additional-dev-20261021-" + page.gameId,
      ]),
    ];
  }
}
write("planning/page-content-blueprints.json", blueprints);
const briefs = read("research/game-content-briefs.json");
for (const b of briefs.games) {
  const r = runtime.find((x) => x.gameId === b.game_id);
  if (r)
    b.currentDevelopmentCase = {
      caseId: "additional-dev-20261021-" + b.game_id,
      sectionId: caseText[b.game_id][0],
      inputResult: r.inputResult,
      evidence: evidence + "runtime-observations.json",
      mediaRights: "restricted-unless-separate-permission",
      finalQualification: "NOT_PASSED",
    };
}
write("research/game-content-briefs.json", briefs);
const keyword = read("research/keyword-video-map.json");
for (const q of searches) {
  const game = keyword.games.find((g) => g.gameId === q.gameId);
  if (!game) continue;
  game.queries = game.queries.filter((x) => x.query !== q.query);
  game.queries.push({
    query: q.query,
    task: "Find the configured Daily implementation and task-specific input/result footage",
    entry: "youtube-native",
    checkedAt: q.checkedAt,
    resultScope: q.results.length + " returned leads; none approved by title",
    evidencePath: evidence + "youtube-searches.json",
  });
  game.currentMediaDecision =
    "No exact-version video adopted; Daily image-reuse permission absent. Candidate re-selection required before publication.";
}
write("research/keyword-video-map.json", keyword);
const profiles = read("research/additional-game-candidates.json");
for (const c of profiles.candidates) {
  const r = runtime.find((x) => x.gameId === c.id);
  if (!r) continue;
  c.inputTest = "effective-input-observed-development-only";
  c.embedConclusion = "development-iframe-runs; final-production-unverified";
  c.mediaStatus = "restricted-without-separate-permission";
  c.eligibility = "not_eligible";
  c.status = "replacement-required-before-release";
  c.currentEvidence = evidence + "runtime-observations.json";
  c.mediaPolicyEvidence = "research/daily-media-policy-review.json";
}
write("research/additional-game-candidates.json", profiles);
const player = read("reports/player-runtime-results.json");
player.additionalDevelopmentReview = {
  checkedAt: now,
  origin: "http://localhost:3001",
  evidence: evidence + "runtime-observations.json",
  effectiveInputGameIds: runtime
    .filter((r) => r.inputResult === "effective-input-observed")
    .map((r) => r.gameId),
  cleanBrowserContext: false,
  productionAcceptance: "NOT_PASSED",
  networkCoverage: "Not a complete startup network audit",
  fixEvidence: evidence + "krillion-before-fix.json",
};
for (const game of player.games) {
  const r = runtime.find((x) => x.gameId === game.gameId);
  if (r) {
    game.currentDevelopmentObservation = r;
    game.currentBuildPublicationQualified = false;
  }
}
player.missingAcceptedCoreInputGameIds = [];
player.pendingPublicationQualificationGameIds = additions.map((g) => g.id);
write("reports/player-runtime-results.json", player);
console.log(
  JSON.stringify({
    effectiveInput: runtime.filter(
      (r) => r.inputResult === "effective-input-observed",
    ).length,
    additional: 8,
    published: 0,
    mediaAdopted: 0,
  }),
);
