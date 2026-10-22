import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { safeFrameUrl } from "../lib/security.ts";
import { videoReviewErrors } from "../lib/video-review.mjs";
import { articleText, nonWhitespaceCharacters } from "../lib/content-text.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
export function validate(mode = "draft", records = {}) {
  const errors = [],
    warnings = [];
  const adoptedMedia = fs.existsSync(
    path.join(root, "research/media-ledger.json"),
  )
    ? read("research/media-ledger.json").items
    : [];
  const check = (ok, msg) => {
    if (!ok) errors.push(msg);
  };
  const videoAnalyses = fs.existsSync(
    path.join(root, "research/video-analysis.json"),
  )
    ? read("research/video-analysis.json").videos
    : [];
  const keys = (o, allowed, label) =>
    check(
      !!o &&
        typeof o === "object" &&
        !Array.isArray(o) &&
        Object.keys(o).every((k) => allowed.includes(k)) &&
        allowed
          .filter((k) => k !== "keywords" && k !== "minimumHeight")
          .every((k) => Object.hasOwn(o, k)),
      label + ": unknown or missing field",
    );
  const main = records.main || read("data/games/main-game.json"),
    additional = records.additional || read("data/games/games.json");
  check(Array.isArray(additional), "Additional Game file must be array");
  const games = [main, ...additional];
  const runtimeIssues =
    records.runtimeIssues ?? read("research/runtime-issues.json");
  check(Array.isArray(runtimeIssues), "Runtime issues must be an array");
  for (const issue of Array.isArray(runtimeIssues) ? runtimeIssues : []) {
    const game = games.find((g) => g.id === issue.gameId);
    if (!game) continue;
    const resolved =
      issue.status === "resolved" && issue.iframeSrc === game.player.iframeSrc;
    if (!resolved) {
      const message = `Game ${game.id}: unresolved runtime issue ${issue.id}`;
      if (mode === "release") check(false, message);
      else warnings.push(message);
    }
  }
  const guides = fs
    .readdirSync(path.join(root, "data/guides"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: f, record: read("data/guides/" + f) }));
  const top = [
    "id",
    "slug",
    "title",
    "shortDescription",
    "status",
    "publishedAt",
    "updatedAt",
    "tags",
    "categories",
    "spoilerPolicy",
    "flags",
    "image",
    "player",
    "seo",
    "content",
    "relatedGameIds",
  ];
  const guideTop = [
    "id",
    "slug",
    "status",
    "title",
    "summary",
    "tags",
    "authorId",
    "spoilerPolicy",
    "publishedAt",
    "updatedAt",
    "cover",
    "seo",
    "sections",
    "relatedGuideIds",
  ];
  const allIds = new Set(),
    allSlugs = new Set();
  function seo(value, label, required = mode === "release") {
    keys(value, ["title", "description", "keywords"], label);
    for (const [field, min, max] of [
      ["title", 40, 60],
      ["description", 140, 160],
    ]) {
      const v = value?.[field];
      check(typeof v === "string", label + "." + field + " must be text");
      if (v) {
        const n = [...v.trim()].length;
        check(n >= min && n <= max, label + "." + field + " length " + n);
      } else if (required) check(false, label + "." + field + " missing");
    }
  }
  function media(m, label, required = mode !== "draft") {
    keys(m, ["src", "alt", "width", "height"], label);
    check(
      typeof m.src === "string" && typeof m.alt === "string",
      label + ": invalid media text",
    );
    if (m.src) {
      check(!!m.alt.trim(), label + ": adopted image alt required");
      const local =
        /^\/images\/[a-z0-9/_-]+\.(png|webp|avif|svg|jpg|jpeg|gif)$/i.test(
          m.src,
        ) && !m.src.includes("..");
      check(local, label + ": unsafe path");
      const file = path.join(root, "public", m.src);
      if (local) check(fs.existsSync(file), label + ": missing file");
      check(
        Number.isInteger(m.width) &&
          m.width > 0 &&
          Number.isInteger(m.height) &&
          m.height > 0,
        label + ": dimensions required",
      );
      const entry = adoptedMedia.find(
        (x) =>
          x.localPath === m.src &&
          x.status === "adopted" &&
          x.rightsStatus === "approved",
      );
      check(
        !!entry,
        label + ": approved adoption record required even in draft",
      );
      if (entry && local && fs.existsSync(file))
        check(
          entry.sha256 ===
            crypto
              .createHash("sha256")
              .update(fs.readFileSync(file))
              .digest("hex"),
          label + ": adopted file hash differs",
        );
    } else {
      warnings.push(label + ": image unadopted");
      if (required) check(false, label + ": required image absent");
    }
  }
  const allowedBlocks = {
    paragraph: ["type", "text"],
    list: ["type", "style", "items"],
    steps: ["type", "items"],
    callout: ["type", "tone", "label", "body"],
    image: ["type", "src", "alt", "width", "height", "caption"],
    table: ["type", "columns", "rows"],
    faq: ["type", "items"],
    video: ["type", "provider", "videoId", "title", "description", "poster"],
  };
  function blocks(items, label, isGuide = false, gameId, guideRoute) {
    check(Array.isArray(items), label + ": blocks must be array");
    if (!Array.isArray(items)) return;
    for (const b of items) {
      check(
        b && allowedBlocks[b.type] && (!isGuide || b.type !== "faq"),
        label + ": unknown block type",
      );
      if (!b || !allowedBlocks[b.type]) continue;
      check(
        Object.keys(b).every((k) => allowedBlocks[b.type].includes(k)),
        label + ": extra block field",
      );
      if (b.type === "paragraph")
        check(
          typeof b.text === "string" &&
            b.text.length >= 20 &&
            b.text.length <= 4000,
          label + ": invalid paragraph",
        );
      if (b.type === "video") {
        check(
          b.provider === "youtube" && /^[\w-]{11}$/.test(b.videoId),
          label + ": invalid YouTube block",
        );
        for (const issue of videoReviewErrors(
          b,
          gameId,
          adoptedMedia,
          videoAnalyses,
          guideRoute,
        ))
          check(false, label + ": " + issue);
      }
      if (b.type === "table")
        check(
          Array.isArray(b.columns) &&
            Array.isArray(b.rows) &&
            b.rows.every(
              (r) => Array.isArray(r) && r.length === b.columns.length,
            ),
          label + ": invalid table",
        );
      if (b.type === "image")
        check(
          typeof b.src === "string" && !!b.src,
          label + ": empty image block is not an adopted image",
        );
      if (b.type === "image")
        media(
          { src: b.src, alt: b.alt, width: b.width, height: b.height },
          label + " image",
        );
      for (const image of [
        b.type === "image" ? b : null,
        b.type === "video" ? b.poster : null,
      ].filter(Boolean)) {
        if (image !== b) media(image, label + " video poster");
        check(
          adoptedMedia.some(
            (m) =>
              m.localPath === image.src &&
              (gameId
                ? m.subjectGameId === gameId
                : m.usedOn?.includes(guideRoute)),
          ),
          label + ": image belongs to another game or page",
        );
      }
    }
  }
  function identity(g, label) {
    check(
      typeof g.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.id),
      label + ": invalid ID",
    );
    check(
      typeof g.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.slug),
      label + ": invalid slug",
    );
    check(!allIds.has(g.id), label + ": duplicate ID");
    allIds.add(g.id);
    check(!allSlugs.has(g.slug), label + ": duplicate slug");
    allSlugs.add(g.slug);
    check(
      ["draft", "published"].includes(g.status),
      label + ": invalid status",
    );
    check(
      ["none", "marked", "full"].includes(g.spoilerPolicy),
      label + ": invalid spoiler policy",
    );
    for (const k of ["publishedAt", "updatedAt"])
      check(
        g[k] === null ||
          (typeof g[k] === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(g[k]) &&
            !Number.isNaN(Date.parse(g[k])) &&
            new Date(g[k]).toISOString().slice(0, 10) === g[k]),
        label + ": invalid date",
      );
    if (g.status === "published")
      check(
        !!g.publishedAt && !!g.updatedAt,
        label + ": published dates required",
      );
    if (g.status === "draft")
      check(
        g.publishedAt === null && g.updatedAt === null,
        label + ": draft dates must remain null",
      );
    if (g.publishedAt && g.updatedAt)
      check(
        g.updatedAt >= g.publishedAt,
        label + ": update predates publication",
      );
  }
  for (const [i, g] of games.entries()) {
    const label = "Game " + g.id;
    const publicationRequired = g.status === "published" || i === 0;
    const mediaRequired =
      mode === "media" || (mode === "release" && publicationRequired);
    keys(g, top, label);
    identity(g, label);
    media(g.image, label + " cover", mediaRequired);
    if (g.image.src)
      check(
        adoptedMedia.some(
          (m) =>
            m.localPath === g.image.src &&
            m.subjectGameId === g.id &&
            m.kind === "image",
        ),
        label + ": cover belongs to another game or asset role",
      );
    seo(g.seo, label + " SEO", mode === "release" && publicationRequired);
    check(
      typeof g.title === "string" && !!g.title.trim(),
      label + ": title required",
    );
    check(
      typeof g.shortDescription === "string" &&
        (!(mode === "release" && publicationRequired) ||
          !!g.shortDescription.trim()),
      label + ": short description required",
    );
    for (const field of ["tags", "categories"])
      check(
        Array.isArray(g[field]) &&
          g[field].every((x) => typeof x === "string" && x.trim()),
        label + ": invalid " + field,
      );
    keys(
      g.player,
      [
        "iframeSrc",
        "aspectRatio",
        "orientation",
        "permissionsPolicy",
        "referrerPolicy",
        "sandbox",
        "loadTimeoutMs",
        "minimumHeight",
      ],
      label + " player",
    );
    check(
      typeof g.player.iframeSrc === "string" && g.player.iframeSrc.length > 0,
      label + ": frame string required",
    );
    if (i > 0)
      check(
        !!safeFrameUrl(g.player.iframeSrc),
        label + ": unsafe additional frame",
      );
    check(
      g.player.loadTimeoutMs >= 3000 && g.player.loadTimeoutMs <= 120000,
      label + ": invalid timeout",
    );
    if (g.player.minimumHeight !== undefined)
      check(
        Number.isInteger(g.player.minimumHeight) &&
          g.player.minimumHeight >= 200 &&
          g.player.minimumHeight <= 2000,
        label + ": invalid minimum player height",
      );
    check(
      ["adaptive", "portrait", "landscape"].includes(g.player.orientation),
      label + ": invalid orientation",
    );
    if (g.player.aspectRatio !== null) {
      const parts =
        typeof g.player.aspectRatio === "string"
          ? g.player.aspectRatio.split("/")
          : [];
      check(
        parts.length === 2 &&
          parts.every(
            (x) =>
              /^\s*\d+(?:\.\d+)?\s*$/.test(x) &&
              Number(x) > 0 &&
              Number.isFinite(Number(x)),
          ),
        label + ": invalid player aspect ratio",
      );
    }
    keys(
      g.flags,
      ["isNewHome", "isFeaturedHome", "isRecommendedHome"],
      label + " flags",
    );
    check(
      Object.values(g.flags).every((v) => typeof v === "boolean"),
      label + ": flags must be booleans",
    );
    check(Array.isArray(g.content), label + ": content array required");
    for (const s of g.content) {
      keys(s, ["id", "heading", "blocks"], label + " section");
      blocks(s.blocks, label, false, g.id);
    }
    check(
      new Set(g.content.map((s) => s.id)).size === g.content.length,
      label + ": section IDs must be unique",
    );
    if (mediaRequired) {
      const captures = g.content
        .flatMap((s) => s.blocks)
        .filter((b) => b.type === "image");
      const captureEntries = captures.map((b) =>
        adoptedMedia.find(
          (m) =>
            m.localPath === b.src &&
            m.subjectGameId === g.id &&
            m.kind === "game-capture" &&
            m.status === "adopted" &&
            m.rightsStatus === "approved",
        ),
      );
      check(
        adoptedMedia.some(
          (m) =>
            m.localPath === g.image.src &&
            m.subjectGameId === g.id &&
            m.kind === "image" &&
            m.status === "adopted" &&
            m.rightsStatus === "approved",
        ),
        label + ": own adopted game cover required",
      );
      check(
        captures.length >= 3 && captureEntries.every(Boolean),
        label + ": three own adopted game captures required",
      );
      check(
        new Set(captures.map((b) => b.src)).size === captures.length &&
          captures.every((b) => b.src !== g.image.src),
        label + ": cover/capture paths must be distinct",
      );
      const hashes = captureEntries.map((m) => m?.sha256).filter(Boolean);
      const coverHash = adoptedMedia.find(
        (m) => m.localPath === g.image.src,
      )?.sha256;
      check(
        hashes.length === captures.length &&
          new Set(hashes).size === hashes.length &&
          !hashes.includes(coverHash),
        label + ": cover/capture bytes must be distinct",
      );
      const tasks = captureEntries
        .map((m) => m?.semanticPurpose?.trim())
        .filter(Boolean);
      check(
        tasks.length === captures.length &&
          new Set(tasks).size === tasks.length,
        label + ": captures require distinct explanatory tasks",
      );
      const videos = g.content
        .flatMap((s) => s.blocks)
        .filter((b) => b.type === "video");
      check(
        videos.length >= 1 &&
          videos.length <= 3 &&
          new Set(videos.map((v) => v.videoId)).size === videos.length,
        label + ": one to three distinct adopted videos required",
      );
    }
    check(
      Array.isArray(g.relatedGameIds) &&
        g.relatedGameIds.length <= 6 &&
        new Set(g.relatedGameIds).size === g.relatedGameIds.length,
      label + ": bad relations",
    );
    for (const id of g.relatedGameIds)
      check(
        id !== g.id && additional.some((x) => x.id === id),
        label + ": missing/self relation",
      );
    if (mode === "release" && publicationRequired) {
      check(g.status === "published", label + ": draft not published");
      check(
        g.relatedGameIds.every((id) =>
          additional.some((x) => x.id === id && x.status === "published"),
        ),
        label + ": published relation points to a draft",
      );
      if (i > 0) check(!!g.player.aspectRatio, label + ": ratio unverified");
      check(
        nonWhitespaceCharacters(articleText(g.content)) >= 4000,
        label + ": body below character floor",
      );
      check(
        g.content.flatMap((s) => s.blocks).filter((b) => b.type === "image")
          .length >= 3,
        label + ": three actual captures missing",
      );
      check(
        g.content.flatMap((s) => s.blocks).some((b) => b.type === "video"),
        label + ": adopted video missing",
      );
      if (i > 0)
        check(
          Array.isArray(g.player.sandbox) &&
            !g.player.sandbox.some((x) => /popups|top-navigation/.test(x)),
          label + ": safe sandbox not established",
        );
    }
  }
  check(
    main.relatedGameIds.length === 0 &&
      Object.values(main.flags).every((v) => v === false),
    "Main game cannot appear in home groups",
  );
  for (const { file, record: g } of guides) {
    const label = "Guide " + g.id;
    keys(g, guideTop, label);
    identity(g, label);
    check(file === g.slug + ".json", label + ": filename mismatch");
    media(
      g.cover,
      label + " cover",
      mode === "media" || (mode === "release" && g.status === "published"),
    );
    if (g.cover.src)
      check(
        adoptedMedia.some(
          (m) =>
            m.localPath === g.cover.src &&
            m.usedOn?.includes("/guides/" + g.slug),
        ),
        label + ": cover not assigned to this Guide",
      );
    seo(g.seo, label + " SEO", mode === "release" && g.status === "published");
    check(
      typeof g.title === "string" && !!g.title.trim(),
      label + ": title required",
    );
    check(typeof g.summary === "string", label + ": summary must be text");
    check(
      Array.isArray(g.tags) &&
        g.tags.length <= 5 &&
        g.tags.every((x) => typeof x === "string" && x.trim()),
      label + ": one to five useful tags required for publication",
    );
    check(
      Array.isArray(g.relatedGuideIds) &&
        new Set(g.relatedGuideIds).size === g.relatedGuideIds.length &&
        g.relatedGuideIds.every(
          (id) => id !== g.id && guides.some((x) => x.record.id === id),
        ),
      label + ": missing/duplicate/self Guide relation",
    );
    check(g.authorId === null, label + ": author identity not verified");
    for (const s of g.sections) {
      keys(s, ["id", "title", "blocks"], label + " section");
      blocks(s.blocks, label, true, undefined, "/guides/" + g.slug);
    }
    if (mode === "release" && g.status === "published") {
      check(
        g.relatedGuideIds.every((id) =>
          guides.some(
            (x) => x.record.id === id && x.record.status === "published",
          ),
        ),
        label + ": published relation points to a draft",
      );
      check(
        g.status === "published" &&
          g.sections.length >= 2 &&
          g.summary.length >= 40 &&
          g.tags.length > 0,
        label + ": incomplete draft",
      );
    }
  }
  if (mode === "release") {
    check(
      additional.filter((g) => g.status === "published").length >= 8,
      "At least eight published additional games required",
    );
    check(
      guides.filter((g) => g.record.status === "published").length >= 2,
      "At least two published Guides required",
    );
    for (const [flag, min, max] of [
      ["isNewHome", 6, 8],
      ["isFeaturedHome", 6, 8],
      ["isRecommendedHome", 6, 6],
    ]) {
      const n = additional.filter(
        (g) => g.status === "published" && g.flags[flag],
      ).length;
      check(n >= min && n <= max, flag + ": invalid published count " + n);
    }
    const ledger = fs.existsSync(path.join(root, "research/media-ledger.json"))
      ? read("research/media-ledger.json").items
      : [];
    const runtime = fs.existsSync(
      path.join(root, "reports/player-runtime-results.json"),
    )
      ? read("reports/player-runtime-results.json")
      : null;
    for (const [i, g] of games.entries()) {
      if (i > 0 && g.status !== "published") continue;
      const images = [
        g.image,
        ...g.content.flatMap((s) => s.blocks).filter((b) => b.type === "image"),
      ];
      for (const image of images)
        check(
          ledger.some(
            (m) =>
              m.localPath === image.src &&
              m.status === "adopted" &&
              m.rightsStatus === "approved",
          ),
          "Game " + g.id + ": media adoption basis missing for " + image.src,
        );
      const captures = g.content
        .flatMap((s) => s.blocks)
        .filter((b) => b.type === "image");
      check(
        captures.every((b) =>
          ledger.some(
            (m) =>
              m.localPath === b.src &&
              m.kind === "game-capture" &&
              m.subjectGameId === g.id,
          ),
        ),
        "Game " + g.id + ": explanatory images are not own game captures",
      );
      for (const v of g.content
        .flatMap((s) => s.blocks)
        .filter((b) => b.type === "video"))
        check(
          ledger.some(
            (m) =>
              m.videoId === v.videoId &&
              m.subjectGameId === g.id &&
              m.status === "adopted" &&
              m.embedStatus === "verified" &&
              m.ageRestrictionStatus === "clear" &&
              m.reviewedRangeIds?.length,
          ),
          "Game " + g.id + ": video evidence not adopted",
        );
      if (i > 0) {
        const row = runtime?.games?.find((r) => r.gameId === g.id);
        check(
          row?.result === "verified" &&
            row?.inputTest?.result === "passed" &&
            runtime.cleanBrowserContext === true,
          "Game " + g.id + ": clean-context effective runtime not verified",
        );
      }
    }
    check(
      fs.existsSync(path.join(root, "seo/page-lastmod.json")),
      "Content fingerprints and dates are not prepared",
    );
  }
  for (const [group, records, field] of [
    ["Game", games, "image"],
    ["Guide", guides.map((g) => g.record), "cover"],
  ]) {
    const paths = new Map(),
      hashes = new Map();
    for (const record of records) {
      const src = record[field].src;
      if (!src) continue;
      const hash = adoptedMedia.find((m) => m.localPath === src)?.sha256;
      check(
        !paths.has(src),
        group + " " + record.id + ": cover path shared with " + paths.get(src),
      );
      if (hash)
        check(
          !hashes.has(hash),
          group +
            " " +
            record.id +
            ": cover bytes shared with " +
            hashes.get(hash),
        );
      paths.set(src, record.id);
      if (hash) hashes.set(hash, record.id);
    }
  }
  return {
    mode,
    result: errors.length ? "failed" : "passed",
    errors,
    warnings,
    counts: {
      games: games.length,
      guides: guides.length,
      publishedAdditional: additional.filter((g) => g.status === "published")
        .length,
    },
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = validate(process.argv[2] || "draft");
  fs.mkdirSync(path.join(root, "reports"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "reports", `validation-${result.mode}.json`),
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.errors.length ? 1 : 0;
}
