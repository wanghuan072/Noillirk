const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, j) => fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
const native = read("research/youtube-native-results.json");
const map = read("research/keyword-video-map.json");
const exact = {
  krillion: '"Krillion Unlimited" youtube gameplay Daily rare answer',
  fermi: '"Fermi" "playdaily" youtube estimation',
  poople: '"Poople" "playdaily" youtube word ladder',
  "size-it-up": '"Size It Up" "playdaily" youtube',
  color: '"Color Game" "playdaily" youtube sliders',
  "color-logo": '"Logo Game" "playdaily" youtube color',
  maptap: '"MapTap" "playdaily" youtube globe',
  songless: '"Songless Unlimited" youtube',
  bandle: '"Bandle Unlimited" "Daily" youtube instruments',
  songspot: '"Songspot" "playdaily" youtube',
  village: '"Silverbrook" "playdaily" youtube leaf',
  "word-hunt": '"Word Hunt" "playdaily" game',
  "traffic-jam": '"Traffic Jam" "playdaily" game',
  "tile-fit": '"Tile Fit" "playdaily" game',
  "coin-maze": '"Coin Maze" "playdaily" game',
  "air-hockey": '"Air Hockey" "playdaily" game',
};
for (const g of map.games) {
  if (exact[g.gameId] && g.queries[0]) g.queries[0].query = exact[g.gameId];
  const n = native.queries.find((x) => x.gameId === g.gameId);
  if (n) {
    g.queries = g.queries.filter((q) => q.entry !== "youtube-native");
    g.queries.push({
      query: n.query,
      task: "Check current game identity and task-specific play before any adoption",
      entry: "youtube-native",
      resultScope: "Observed result list only; no candidate adopted",
      evidencePath: "research/youtube-native-results.json",
    });
    for (const r of n.results) {
      if (!r.url) continue;
      const u = new URL(r.url),
        id = u.searchParams.get("v") || u.pathname.split("/").at(-1);
      if (!g.candidates.some((v) => v.videoId === id))
        g.candidates.push({
          videoId: id,
          title: r.title,
          url: "https://www.youtube.com/watch?v=" + id,
          identity: "unverified",
          adoption: "not_adopted",
          enterSegmentAnalysis:
            ["krillion", "fermi"].includes(g.gameId) && id === "UHWWW-7f0ag",
          reason: ["color", "color-logo", "word-hunt"].includes(g.gameId)
            ? "Results do not establish the current Daily implementation; cannot use as page media."
            : "Title suggests a lead; exact identity, version, full segments, age restrictions and embed playback remain unverified.",
        });
    }
  }
}
for (const v of map.games[0].candidates)
  if (v.reason?.includes("research paused"))
    v.reason =
      "Research resumed; this lead has not yet been opened or segmented. No adoption.";
map.status = "partial-native-searches-recorded-no-adopted-video";
write("research/keyword-video-map.json", map);
const analysis = read("research/video-analysis.json");
const main = analysis.videos.find((v) => v.videoId === "oMe1Mz3Maoo");
const samples = [
  [
    "00:05",
    "Mode/start interface; Classic selected",
    "No creator action concluded from still frame",
    "Daily, Classic, Endless and start controls visible",
    ["Mode selection exists"],
    ["Exact scoring or acceptance"],
  ],
  [
    "00:07",
    "Forest prompt with answer field",
    "A short answer is typed",
    "Text remains in editable field",
    ["Typed response interface"],
    ["Submission or resulting tier"],
  ],
  [
    "00:20",
    "Forest prompt with countdown near deadline",
    "A longer answer is partially entered",
    "Clock and editable response remain visible",
    ["Time cost of entering a longer phrase is a useful task to investigate"],
    ["Long answers are always rejected", "Exact result of this phrase"],
  ],
  [
    "00:25",
    "Forest transition state",
    "Not observed in this sample",
    "Input panel absent in sampled transition",
    ["An intervening state exists"],
    ["Which answer was accepted", "Cause or tier of transition"],
  ],
  [
    "00:30",
    "Forest climb transition",
    "No new input in frame",
    "Next climb countdown visible",
    ["Run advances between prompt scenes"],
    ["Specific altitude formula"],
  ],
  [
    "01:17",
    "Higher landscape with prompt and response field",
    "A response is partly typed",
    "Entry field still active",
    ["The same typed-answer task continues above forest scene"],
    ["Prior result tier", "Complete wording of cropped prompt"],
  ],
];
main.segments = main.segments.filter(
  (s) => !s.range?.startsWith("00:") && !s.range?.startsWith("01:"),
);
samples.forEach((s, i) =>
  main.segments.push({
    id: "noillirk-sample-" + (i + 1),
    range: s[0],
    observationMethod:
      "Paused/playing frame reached with native YouTube controls; sampled, not continuous coverage",
    state: s[1],
    action: s[2],
    visibleResult: s[3],
    supports: s[4],
    doesNotSupport: [...s[5], "Embed eligibility"],
    successOrFailureReason: "Not established from this sample",
    versionScope: "Daily forest/balloon interface visible in creator video",
  }),
);
analysis.videos = analysis.videos.filter((v) => v.videoId !== "UHWWW-7f0ag");
for (const gameId of ["fermi", "krillion"])
  analysis.videos.push({
    gameId,
    videoId: "UHWWW-7f0ag",
    publisher: "Rare K",
    duration: "PT6M24S",
    identity: "version-comparison-required",
    adoption: "not_adopted",
    segments:
      gameId === "fermi"
        ? [
            {
              id: "fermi-towels-opening",
              range: "00:02 and 00:30",
              state:
                "Coral Fermi.gg question card asking for a count of beach towels over a beach area",
              action:
                "Creator discusses breaking the area estimate into dimensions; no final entry read in these samples",
              visibleResult: "Question remains awaiting an estimate",
              successOrFailureReason: "No judged result yet",
              supports: [
                "Area divided by area-per-item is the relevant estimation task for this question",
              ],
              doesNotSupport: [
                "The exact response accepted",
                "Current playdaily.org/fermi visual/version equivalence",
              ],
              versionScope: "Fermi.gg daily card shown in this video",
            },
            {
              id: "fermi-factor-result",
              range: "02:10",
              state: "Blue result card and distribution chart",
              action:
                "Submission occurred before this sampled frame; its typed number was not captured",
              visibleResult: "14.2x and Too Low are visible",
              successOrFailureReason:
                "Guess is below target by a multiplicative factor; do not infer unseen numerical input",
              supports: [
                "The visible version reports direction and a ratio error",
              ],
              doesNotSupport: [
                "An exact recommended answer",
                "Our own accepted input",
                "Current Daily iframe compatibility",
              ],
              versionScope: "Fermi.gg version in creator video",
            },
          ]
        : [
            {
              id: "krillion-underwater-prompt",
              range: "03:20",
              state:
                "Underwater scene with constrained category, entry field, clock and Dive control",
              action:
                "Creator has reached a new prompt; no accepted answer observed in this sample",
              visibleResult: "Empty/awaiting answer field visible",
              successOrFailureReason: "Not established",
              supports: ["Underwater typed-answer interface with time limit"],
              doesNotSupport: [
                "Exact rarity score",
                "Unseen submission result",
                "Equivalence to local current iframe",
              ],
              versionScope: "Krillion scene in dated creator video",
            },
          ],
    limitations: [
      "Sampled observations only, not complete continuous ranges",
      "No embedding/age restriction test",
      "No downloaded video or adopted screenshots",
      "Do not substitute creator input for local effective-input verification",
    ],
  });
analysis.status = "partial-observations-no-media-adoption";
write("research/video-analysis.json", analysis);
const candidates = read("research/additional-game-candidates.json");
for (const c of candidates.candidates) {
  const id = c.gameId || c.id;
  if (native.queries.some((n) => n.gameId === id))
    c.nativeVideoResearch = {
      evidencePath: "research/youtube-native-results.json",
      status: ["color", "color-logo", "word-hunt"].includes(id)
        ? "no-current-game-candidate-established"
        : "leads-found-not-qualified",
    };
}
write("research/additional-game-candidates.json", candidates);
