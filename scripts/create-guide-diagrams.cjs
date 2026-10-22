const fs = require("fs"),
  sharp = require("sharp"),
  crypto = require("crypto");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const escape = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const text = (x, y, s, size = 34, color = "#123c3b") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${color}">${escape(s)}</text>`;
const box = (x, y, w, h, color = "#fff") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${color}"/>`;
const canvas = (label, title, body, dark = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="660" viewBox="0 0 900 660"><rect width="900" height="660" rx="24" fill="${dark ? "#123c3b" : "#e6eee4"}"/><g font-family="Segoe UI,Arial,sans-serif" font-weight="600">${text(48, 63, label, 23, dark ? "#d7e8da" : "#49615c")}${text(48, 128, title, 43, dark ? "#fff" : "#123c3b")}${body}</g></svg>`;
const rows = (items) =>
  items
    .map(
      ([title, body, fill], i) =>
        box(48, 180 + 145 * i, 804, 128, fill || "#fff") +
        text(78, 229 + 145 * i, title, 33) +
        text(78, 277 + 145 * i, body, 31),
    )
    .join("");
const chip = (x, y, v, fill = "#fff") =>
  box(x, y, 96, 82, fill) + text(x + 14, y + 55, v, 33);
const answer = "noillirk-answer-strategy",
  scoring = "noillirk-scoring-and-endless";
const assets = [
  [
    answer,
    answer,
    "cover",
    "Three decisions in order: find the category, choose a familiar fit, submit before the clock",
    canvas(
      "NOILLIRK / ANSWER CHOICES",
      "One clear answer",
      ["Find the category", "Choose a familiar fit", "Submit before the clock"]
        .map(
          (v, i) =>
            box(48, 180 + i * 126, 804, 104) +
            text(76, 246 + i * 126, "0" + (i + 1), 32, "#b73525") +
            text(156, 246 + i * 126, v, 37),
        )
        .join("") +
        text(48, 618, "15 seconds · one response · no speed bonus", 27),
    ),
  ],
  [
    scoring,
    scoring,
    "cover",
    "Accepted results earn points, while Endless misses remove a balloon and Sky High can restore one",
    canvas(
      "NOILLIRK / RESULTS AND SURVIVAL",
      "Read two different signals",
      box(48, 180, 804, 180, "#d7e8da") +
        text(78, 233, "POINTS", 27) +
        text(78, 309, "4 → 8 → 16 → 32 → 64 → 100", 43) +
        box(48, 386, 804, 186) +
        text(78, 440, "ENDLESS BALLOONS", 27) +
        text(78, 493, "Accepted: keep · Miss: lose one", 34) +
        text(78, 541, "Sky High: restore one, up to three", 32) +
        text(
          48,
          619,
          "A low accepted score can still save the run.",
          27,
          "#d7e8da",
        ),
      true,
    ),
  ],
  [
    answer,
    "noillirk-category-practice",
    "body",
    "Practice category check: a towel is something to take to the beach; sunny describes the weather",
    canvas(
      "PRACTICE / NOT A LIVE ANSWER BOARD",
      "Something you take to the beach",
      box(48, 185, 804, 154) +
        text(78, 239, "TOWEL", 37) +
        text(78, 297, "An object you can pack and carry.", 33) +
        box(48, 365, 804, 154, "#fff0da") +
        text(78, 420, "SUNNY", 37) +
        text(78, 478, "Weather, rather than a carried object.", 32) +
        text(48, 594, "Check the requested kind of answer first.", 30) +
        text(
          48,
          633,
          "No acceptance or rank is promised for this exercise.",
          23,
        ),
    ),
  ],
  [
    answer,
    "noillirk-answer-recovery",
    "body",
    "Three feedback paths: refused with time left means try a different fit, accepted means read the result, timeout means advance",
    canvas(
      "AFTER SUBMITTING / CHOOSE THE NEXT ACTION",
      "Read the state before you act",
      rows([
        [
          "Refused + time left",
          "Change the answer; try one clear fit.",
          "#fff0da",
        ],
        ["Accepted + tier shown", "Read the result; this prompt is finished."],
        ["Time ended / No Lift", "Review the miss; advance to the next."],
      ]),
    ),
  ],
  [
    scoring,
    "noillirk-score-comparison",
    "body",
    "Two invented seven-prompt runs both total 224 points: seven 32-point answers, or 100, 64, 32, 16, 8, 4 and a miss",
    canvas(
      "WORKED ARITHMETIC / NOT A RECORDED RUN",
      "224 points, two different stories",
      text(48, 208, "RUN A · seven accepted Cloud Nine answers", 29) +
        Array.from({ length: 7 }, (_, i) => chip(48 + 112 * i, 240, 32)).join(
          "",
        ) +
        text(48, 387, "RUN B · mixed tiers and one missed prompt", 29) +
        [100, 64, 32, 16, 8, 4, 0]
          .map((v, i) =>
            chip(48 + 112 * i, 420, v, v === 0 ? "#fff0da" : "#fff"),
          )
          .join("") +
        text(48, 589, "Same total. Different decisions to improve.", 31) +
        text(
          48,
          633,
          "Review each prompt instead of judging only the total.",
          24,
        ),
    ),
  ],
  [
    scoring,
    "noillirk-last-balloon",
    "body",
    "With one Endless balloon, an accepted four-point answer preserves one, a miss ends the run, and Sky High restores the count to two",
    canvas(
      "ENDLESS / START WITH ONE BALLOON LEFT",
      "What does the next result change?",
      rows([
        ["Accepted · 4 points", "1 balloon → 1 balloon"],
        ["Pass or timeout · 0", "1 balloon → run ends", "#fff0da"],
        ["Sky High · 100 points", "1 balloon → 2 balloons", "#d7e8da"],
      ]),
    ),
  ],
];
(async () => {
  const ledger = read("research/media-ledger.json");
  fs.mkdirSync("design/guides", { recursive: true });
  for (const [slug, name, role, alt, svg] of assets) {
    const source = `design/guides/${name}.svg`,
      file = `public/images/guides/${name}.webp`,
      localPath = `/images/guides/${name}.webp`;
    fs.writeFileSync(source, svg);
    await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(file);
    const id = role === "cover" ? slug + "-cover" : name;
    const item = {
      ...(ledger.items.find((m) => m.id === id) || {}),
      id,
      kind: "image",
      originalLocation: source,
      capturedOrAccessedAt: "2026-10-22",
      rightsStatus: "approved",
      rightsBasis:
        "Project-original explanatory shapes and typography; no third-party game artwork, screenshots, logos or video frames copied.",
      captureMethod: "generated-original",
      videoTimecode: "",
      contentDescription: alt,
      versionScope:
        "Daily rules checked 2026-10-22; explanatory diagram, not a game capture",
      localPath,
      width: 900,
      height: 660,
      fileBytes: fs.statSync(file).size,
      sha256: crypto
        .createHash("sha256")
        .update(fs.readFileSync(file))
        .digest("hex"),
      usedOn: [`/guides/${slug}`],
      altDirection: alt,
      slotId: id,
      videoId: null,
      videoAnalysisId: null,
      reviewedRangeIds: [],
      publisherName: null,
      reviewedTimeRange: null,
      embedStatus: null,
      ageRestrictionStatus: null,
      posterMediaId: null,
      posterLocalPath: null,
      subjectGameId: "noillirk",
      semanticPurpose: alt,
      cropStrategy: "contain",
      contrastChecks: [
        "Dark text on light panels; HTML explanation accompanies image",
      ],
      pagePurpose: alt,
      status: "adopted",
    };
    const i = ledger.items.findIndex((m) => m.id === id);
    if (i < 0) ledger.items.push(item);
    else ledger.items[i] = item;
    if (role === "cover") {
      const p = `data/guides/${slug}.json`,
        guide = read(p);
      guide.cover = { src: localPath, alt, width: 900, height: 660 };
      write(p, guide);
    }
  }
  write("research/media-ledger.json", ledger);
  console.log(
    "Six Guide diagrams generated; unrelated media registrations preserved.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
