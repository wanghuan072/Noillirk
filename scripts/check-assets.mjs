import fs from "node:fs";
import path from "node:path";
import { inspectImage } from "../lib/asset-inspection.mjs";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const root = fs.realpathSync("public/images");
const ledger = read("research/media-ledger.json").items;
const main = read("data/games/main-game.json"),
  games = [main, ...read("data/games/games.json")];
const guides = fs
  .readdirSync("data/guides")
  .filter((f) => f.endsWith(".json"))
  .map((f) => read("data/guides/" + f));
const refs = [];
for (const record of [...games, ...guides]) {
  const sections = record.content || record.sections;
  for (const m of [
    record.image || record.cover,
    ...sections
      .flatMap((s) => s.blocks)
      .flatMap((b) =>
        b.type === "image"
          ? [b]
          : b.type === "video" && b.poster
            ? [b.poster]
            : [],
      ),
  ])
    if (m.src) refs.push({ ...m, contentId: record.id });
}
const rows = [],
  errors = [];
for (const entry of ledger.filter(
  (m) => m.status === "adopted" && m.localPath,
)) {
  const local = entry.localPath;
  let result;
  try {
    if (entry.rightsStatus !== "approved")
      throw Error("adoption lacks approved use basis");
    if (
      !/^\/images\/[a-z0-9/_-]+\.(png|jpe?g|webp|avif|gif|svg)$/i.test(local) ||
      local.includes("..")
    )
      throw Error("unsafe image path");
    const target = fs.realpathSync(path.join("public", local));
    if (!target.startsWith(root + path.sep))
      throw Error("image resolves outside public/images");
    const bytes = fs.readFileSync(target);
    result = await inspectImage(bytes, entry);
    for (const ref of refs.filter((m) => m.src === local))
      if (
        ref.width !== result.actual.width ||
        ref.height !== result.actual.height
      )
        result.issues.push(
          ref.contentId + ": JSON dimensions differ from actual image",
        );
  } catch (error) {
    result = { actual: null, issues: [error.message] };
  }
  rows.push({
    id: entry.id,
    path: local,
    ...result,
    result: result.issues.length ? "failed" : "passed",
  });
  errors.push(...result.issues.map((issue) => entry.id + ": " + issue));
}
for (const ref of refs)
  if (!rows.some((row) => row.path === ref.src))
    errors.push(
      ref.contentId + ": image has no adopted file inspection " + ref.src,
    );
const output = {
  checkedAt: new Date().toISOString(),
  scope:
    "Adopted local files and nonempty Game/Guide references only. Decode/dimension/hash checks do not establish game identity, crop quality, media completeness or license interpretation.",
  result: errors.length ? "failed" : "passed",
  mediaAcceptance: "NOT_PASSED",
  missingGameCovers: games.filter((g) => !g.image.src).map((g) => g.id),
  rows,
  errors,
};
fs.writeFileSync(
  "reports/asset-file-results.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      result: output.result,
      inspected: rows.length,
      missingGameCovers: output.missingGameCovers.length,
      errors,
    },
    null,
    2,
  ),
);
process.exitCode = errors.length ? 1 : 0;
