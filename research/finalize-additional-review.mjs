import fs from "node:fs";
import crypto from "node:crypto";
import sharp from "sharp";

const now = new Date().toISOString();
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const evidence = "reports/acceptance-evidence/additional-review-20261021";
const ids = read("data/games/games.json").map((g) => g.id);
const analysis = read("research/video-analysis.json");
const commonLimits = [
  "Sampled visible frames and playback progress, not continuous annotation of every action.",
  "No downloaded/rehosted video, transcript or adopted video frames.",
  "An original same-name game's video cannot qualify a Daily Unlimited implementation.",
];
function segment(id, range, state, action, visibleResult, supports, versionScope) {
  return {
    id, range, state, action, visibleResult,
    successOrFailureReason: "Only the explicitly described visible outcome is established; unseen input and scoring causes are not inferred.",
    supports, doesNotSupport: ["Unseen actions or a global scoring formula", "Current Daily implementation equivalence"], versionScope,
  };
}
const videos = [
  { gameId: "krillion", videoId: "UHWWW-7f0ag", publisher: "Rare K", duration: "PT6M24S", identity: "different-version", versionCompatibility: "rejected", adoption: "rejected-version-mismatch", segments: [segment("krillion-author-host-comparison", "03:20–03:43 sampled", "Blue underwater prompt asking for mashed/pureed food", "Creator types a partial cauliflower answer; submission not established in the sampled frame", "Input and scene visible; expanded description identifies Krillion.io", ["Original Krillion.io identity", "Typed category response"], "Krillion.io daily video, not verified Daily Unlimited") ] },
  { gameId: "poople", videoId: "AZWEpN16Hg4", publisher: "Horus He", duration: "PT28.141S", identity: "different-version", versionCompatibility: "rejected", adoption: "rejected-version-mismatch", segments: [segment("poople-promo-rule", "00:00, 00:08.26, 00:26 samples during playback", "Illustrated WORD tiles and checkmark", "Promotional explanation animates letter tiles; no live accepted keyboard submission observed", "End card explicitly shows POOPLEGAME.COM", ["Original publisher identity", "Promotional word-change theme"], "Original Poople promotional clip") ] },
  { gameId: "size-it-up", videoId: "okfKMjy_ByY", publisher: "Azwell", duration: "PT18M52S", identity: "version-comparison-required", versionCompatibility: "unresolved", adoption: "not_adopted", segments: [segment("size-outline-opening", "Opening approximately 00:00–00:15; exact final time not captured", "Dark blue outline board with pufferfish reference and dynamite target", "Opening demonstration watched; exact adjustment and result not read", "Reference and zoom controls visible", ["Outline comparison in the recorded version"], "Opening video sample; Daily Mug/Burrito HUD equivalence not established") ] },
  { gameId: "color", videoId: "YZOWgyiyNxw", publisher: "Brainy Quiz", identity: "different-game", versionCompatibility: "rejected", adoption: "rejected-identity", segments: [segment("color-quiz-mismatch", "Playing sample; exact time not captured", "Animal color quiz with BLACK/YELLOW/PINK/BLUE choices", "Quiz choices presented", "No HSB memory sliders or target reconstruction", ["Different game identity"], "Quiz video, not Daily Color Game") ] },
  { gameId: "color-logo", videoId: "CC8tKb7AhQo", publisher: "ted-gamedev", identity: "different-game", versionCompatibility: "rejected", adoption: "rejected-preview-identity", segments: [segment("logo-ar-preview", "Preview only; no timed gameplay review", "AR logos over a floor with colored dots", "No live player action verified", "AR scene differs from HSB reconstruction UI", ["Preview does not match target game"], "AR preview only") ] },
  { gameId: "maptap", videoId: "f4HK8BQr060", publisher: "GeoJou", duration: "PT14M12S", identity: "different-version", versionCompatibility: "unresolved", adoption: "not_adopted", segments: [segment("maptap-terrain-version", "Opening through 00:35.5; opening/paused samples", "Satellite/terrain globe, Panama City opening and Dalian/China later prompt", "Playback advances between visible prompt samples; exact map click not established", "Terrain globe differs from current Daily wireframe renderer", ["Recorded geographic location task"], "GeoJou terrain MapTap recording; current Daily compatibility unverified") ] },
  { gameId: "word-hunt", videoId: "ve19OagWuB4", publisher: "Artie's Amazing World", duration: "PT4M29.761S", identity: "different-game", versionCompatibility: "rejected", adoption: "rejected-identity", segments: [segment("wordhunt-large-wordsearch", "00:00–00:49.237 playback; opening/final samples", "Large approximately 12×12 word-search board with BOXING prompt", "Video reveals a diagonal word and countdown", "Large quiz grid, not interactive 4×4 free word tracing", ["Different word-search identity"], "Video quiz word search") ] },
  { gameId: "krillion", videoId: "YU2mpcddchs", publisher: "This Mom Games", duration: "PT3M35S", identity: "version-comparison-required", versionCompatibility: "unresolved", adoption: "not_adopted", segments: [segment("krillion-daily-dive-opening", "Opening sample only; exact time not captured", "THE DAILY DIVE, seven prompts, 25 seconds, ship and water", "Opening Begin Descent screen observed", "Daily-labelled mode; Unlimited equivalence not established", ["Daily-labelled opening configuration"], "Opening clip only") ] },
  { gameId: "astray", videoId: "7v095uwDgeg", publisher: "SAM_ULSTER", duration: "PT1M55.081S", identity: "different-game", versionCompatibility: "rejected", adoption: "rejected-identity", segments: [segment("astray-fps-mismatch", "00:13.614 playing sample", "Bright red/blue first-person maze with Move/Jump/Dash", "First-person prototype gameplay shown", "Not author-hosted top-down rolling-ball Astray", ["Different prototype identity"], "SAM_ULSTER first-person maze") ] },
  { gameId: "hello-wordl", videoId: "VIavCrvnrDs", publisher: "Ihavenoname248", duration: "PT1M34.801S", title: 'Hello Wordl "All Lengths" in 1:28.93', identity: "exact-game", versionCompatibility: "observed-interface-match", adoption: "candidate-not-adopted", embedStatus: "observed-playback-local-development", segments: [
    segment("hello-eight-letter-feedback", "00:35.549 in local nocookie embed", "Eight-letter rows CLOTHING, SUBFRAME and UPWARDLY with colored tiles and marked keyboard", "Creator has submitted guesses; individual preceding keystrokes not observed", "Mixed tile feedback and green LY ending visible", ["Eight-letter board and color feedback", "Same author-hosted word-game interface"], "Hello Wordl author host, adjustable 4–11 letters; theme differs"),
    segment("hello-eleven-letter-feedback", "01:26.95 top-level sample", "Eleven-letter guesses including INSCRUTABLE, VIDEOGRAPHY, MALFUNCTION and FAMILIARITY", "Playback has progressed to longer boards", "Mixed color feedback; no all-green completion claimed", ["Long-word board", "Letter-position feedback"], "Creator's Hello Wordl all-lengths recording"),
  ], embedObservation: { origin: "http://localhost:3001", src: "https://www.youtube-nocookie.com/embed/VIavCrvnrDs", observedTimes: [14.947,35.549,94.801], ended: true, readyState: 4, evidencePath: evidence + "/hello-wordl-local-embed.png", restrictionScope: "No login/age/embed gate observed in this existing browser context; no global region or clean-context claim", overlay: "Cyan stopwatch is creator overlay, not built-in game timer" } },
];
for (const v of videos) {
  v.checkedAt = now; v.limitations = commonLimits;
  const i = analysis.videos.findIndex((x) => x.gameId === v.gameId && x.videoId === v.videoId);
  if (i < 0) analysis.videos.push(v); else analysis.videos[i] = v;
}
for (const v of analysis.videos) if (v.limitations) v.limitations = [...new Set(v.limitations)];
analysis.status = "additional-version-rejections-and-licensed-candidate-observations-no-public-adoption";
analysis.updatedAt = now; write("research/video-analysis.json", analysis);

const ledger = read("research/media-ledger.json");
const purposes = { cover: "Four-letter board identity", feedback: "Five-letter position feedback", "duplicate-letters": "Repeated-letter count and position", "long-word": "Eleven-letter board and duplicate feedback" };
const imageRows = [];
for (const [name, purpose] of Object.entries(purposes)) {
  const p = `research/media-candidates/hello-wordl/${name}.png`;
  const bytes = fs.readFileSync(p); const m = await sharp(bytes).metadata();
  const reason = ["cover","duplicate-letters"].includes(name) ? "Saved file is a flat background; game content missing" : "Saved clip excludes most or part of board/title; subject and text cut off";
  const item = { id: "hello-wordl-candidate-" + name, kind: "image", subjectGameId: "hello-wordl", originalLocation: "https://hellowordl.net/", capturedOrAccessedAt: now, rightsStatus: "license-basis-reviewed-candidate-only", rightsBasis: "Author repository lynn/hello MIT, copyright 2022 Lynn; host association checked. Any adoption must carry required notice. This file is rejected on visual quality regardless of rights.", licenseUrl: "https://github.com/lynn/hello/blob/main/LICENSE", captureMethod: "browser-screenshot-clip", privateEvidencePath: p, localPath: null, width: m.width, height: m.height, fileBytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), semanticPurpose: purpose, cropStrategy: "contain-if-recaptured", usedOn: [], status: "rejected-capture-quality", rejectionReason: reason, recaptureRequired: true };
  const i = ledger.items.findIndex((x) => x.id === item.id); if (i < 0) ledger.items.push(item); else ledger.items[i] = item;
  imageRows.push(item);
}
for (const v of videos) {
  const item = { id: `${v.gameId}-video-${v.videoId}`, kind: "video", subjectGameId: v.gameId, originalLocation: `https://www.youtube.com/watch?v=${v.videoId}`, videoId: v.videoId, capturedOrAccessedAt: now, publisherName: v.publisher, status: v.adoption, rightsStatus: "not-adopted-no-rehosting", embedStatus: v.embedStatus || "not-tested", reviewedRangeIds: v.segments.map(s=>s.id), usedOn: [], localPath: null, semanticPurpose: v.gameId === "hello-wordl" ? "Compare short and long boards and letter feedback after recapture/selection" : "Identity/version screening; excluded from public content", versionScope: v.segments.map(s=>s.versionScope).join("; ") };
  const i = ledger.items.findIndex((x) => x.id === item.id); if (i < 0) ledger.items.push(item); else ledger.items[i] = item;
}
ledger.status = "five-original-adopted-assets-additional-research-only-media-not-passed";
write("research/media-ledger.json", ledger);
write("reports/candidate-image-review.json", { checkedAt: now, status: "RECAPTURE_REQUIRED", reviewedFiles: imageRows, publicGameImagesAdopted: 0, scope: "Actual saved pixels decoded and visually reviewed; dimensions alone did not establish correct subject capture" });

const viewport = read("planning/player-viewport-decisions.json");
viewport.wordHunt.observation = "640px viewport exposes the board. Effective S→U→N trace accepted as SUN +100 in the current development site frame; final production/security qualification remains pending.";
viewport.krillion = { minimumHeight: 640, sandboxAddition: "allow-forms", reason: "Observed browser refusal of form submission without allow-forms; following scoped data change tempura accepted +8 points / 80m in development", evidence: evidence + "/krillion-before-fix.json", retest: evidence + "/krillion.png" };
write("planning/player-viewport-decisions.json", viewport);

const manifest = read("reports/acceptance-manifest.json");
for (const id of ids) for (const requirementId of ["R07","R14","R23","R26","R34"]) {
  const key = `additional-review-20261021-${id}-${requirementId}`;
  const item = { id: key, requirementId, route: "/games/"+id, contentId: id, viewport: "1280×720 development; viewing mode varies per case", method: "Actual native input, visible result, screenshot review, version/rights screening", evidencePaths: [evidence+"/runtime-observations.json",evidence+`/${id}.png`,"research/daily-media-policy-review.json","research/video-analysis.json"], firstResult: "partial", issue: "Effective input observed, but image reuse is restricted and no matching video/media package adopted. Production clean-context network audit not complete.", fixFiles: id === "krillion" ? ["data/games/games.json"] : [], retestResult: requirementId === "R07" ? "development-input-observed; publication-pending" : "partial", checkedAt: now, scope: "Development evidence only; no media or delivery pass" };
  const i = manifest.items.findIndex(x=>x.id===key); if(i<0)manifest.items.push(item);else manifest.items[i]=item;
}
manifest.mediaAcceptance = "NOT_PASSED"; manifest.overallDelivery = "NOT_PASSED"; manifest.generatedAt = now;
manifest.currentRound = { allEightEffectiveInputObserved: true, adoptedGameMedia: 0, helloWordlImageFilesRejected: 4, browserResearchStatus: "unavailable-after-three-consecutive-30s-timeouts", startupAuthorized: false };
write("reports/acceptance-manifest.json",manifest);
write("reports/browser-research-interruption.json", { checkedAt: now, status: "blocked-tool-channel", observations: ["Navigation/getTab on research tab 8 timed out", "Binding existing video research tab 9 timed out", "Creating one recovery research tab timed out"], attempts: 3, timeoutMsPerAttempt: 30000, actionsNotTaken: ["No project restart", "No browser process termination", "No security bypass", "No invented video observations"], nextRequiredCapability: "Responsive browser research channel for actual video viewing, recapture and final candidate input tests" });
console.log({ originalAdditionalInputs: ids.length, videoReviewsUpdated: videos.length, rejectedHelloImageFiles: imageRows.length, adoptedGameMedia: 0 });
