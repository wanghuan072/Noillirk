import fs from "node:fs";
import sharp from "sharp";
import { reconcile } from "../seo/fingerprints.mjs";
import inputIdentity from "./input-identity.cjs";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const config = read("config/site.json");
const build = read(".next-preview/build-identity.json");
const dates = read("seo/page-lastmod.json").pages;
const inventory = read("config/routes.json").draftPaths;
const results = [];
const errors = [];
const year = new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
}).format(new Date());
const check = (ok, message) => {
  if (!ok) errors.push(message);
};
check(
  build.sourceFingerprint === inputIdentity(),
  "Compiled artifact source mismatch; rebuild required",
);
for (const route of inventory) {
  const file =
    ".next-preview/server/app/" +
    (route === "/" ? "index" : route.slice(1)) +
    ".html";
  const html = fs.readFileSync(file, "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const og = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
  const twitter = html.match(
    /<meta name="twitter:image" content="([^"]+)"/i,
  )?.[1];
  const local = [];
  const expect = new URL(route, config.origin).href;
  if (!canonical || new URL(canonical).href !== expect) local.push("canonical");
  if (og !== config.origin + "/images/og-image.png" || twitter !== og)
    local.push("social image");
  if (/noillirk\.me|wyong@|\{(?:email|domain)\}/.test(html))
    local.push("old identity or unresolved token");
  if (
    !html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\s+/g, " ")
      .includes(
        `Copyright © ${year} ${new URL(config.origin).hostname}. All rights reserved.`,
      )
  )
    local.push("footer");
  if (
    !html.includes("/favicon.ico") ||
    !html.includes("/images/apple-touch-icon.png")
  )
    local.push("icons");
  const jsons = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
  if (
    !jsons.length ||
    jsons.some((j) => JSON.stringify(j).includes("noillirk.me"))
  )
    local.push("schema");
  if (
    !jsons.some((j) =>
      j["@graph"]?.some(
        (n) => n["@type"] === "WebSite" && n.url === config.origin + "/",
      ),
    )
  )
    local.push("website graph");
  if (
    ["/contact", "/privacy", "/terms", "/copyright", "/about"].includes(
      route,
    ) &&
    !html.includes(config.email)
  )
    local.push("support contact");
  for (const problem of local) errors.push(route + ": " + problem);
  results.push({
    route,
    canonical,
    social: og,
    schemas: jsons.length,
    errors: local,
    result: local.length ? "failed" : "passed-static",
  });
}
const xml = fs.readFileSync(
  ".next-preview/server/app/sitemap.xml.body",
  "utf8",
);
check(
  xml.includes("http://www.sitemaps.org/schemas/sitemap/0.9"),
  "Standard sitemap namespace",
);
const entries = [
  ...xml.matchAll(
    /<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>\s*<\/url>/gs,
  ),
].map((m) => ({ url: m[1], lastmod: m[2] }));
check(entries.length === inventory.length, "Sitemap detail coverage");
check(
  new Set(entries.map((x) => x.url)).size === entries.length,
  "Duplicate sitemap URL",
);
for (const route of inventory) {
  const entry = entries.find(
    (e) => e.url === new URL(route, config.origin).href,
  );
  check(
    !!entry && entry.lastmod === dates[route]?.lastModified,
    route + ": sitemap persisted date",
  );
}
check(
  !/\/preview|media-check|noillirk\.me/.test(xml),
  "Private/old sitemap URL",
);
const before = fs.readFileSync("seo/page-lastmod.json", "utf8");
const payload = {
  "/games/a": { visible: "first", recommended: ["a", "b"] },
  "/guides/a": { visible: "unchanged" },
};
const first = reconcile({}, payload, "2026-10-20", true),
  same = reconcile(first.pages, payload, "2027-01-01", true),
  changed = reconcile(
    first.pages,
    {
      ...payload,
      "/games/a": { visible: "second", recommended: ["a", "c"] },
      "/guides/new": { visible: "new" },
    },
    "2026-10-22",
    true,
  );
check(
  JSON.stringify(same.pages) === JSON.stringify(first.pages),
  "No-change dates advanced",
);
check(
  changed.pages["/guides/a"].lastModified === "2026-10-20" &&
    changed.pages["/games/a"].lastModified === "2026-10-22" &&
    changed.pages["/guides/new"].lastModified === "2026-10-22",
  "Changed/new selective dates",
);
check(
  fs.readFileSync("seo/page-lastmod.json", "utf8") === before,
  "Audit altered date ledger",
);
const icons = [];
for (const [file, w, h] of [
  ["public/images/logo.png", 360, 84],
  ["public/images/og-image.png", 1200, 630],
  ["public/images/icon.png", 512, 512],
  ["public/images/apple-touch-icon.png", 180, 180],
]) {
  const m = await sharp(file).metadata();
  check(m.width === w && m.height === h, file + ": dimensions");
  icons.push({ file, width: m.width, height: m.height });
}
const ico = fs.readFileSync("app/favicon.ico");
check(ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) === 5, "ICO header");
for (let i = 0; i < 5; i++) {
  const p = 6 + i * 16,
    len = ico.readUInt32LE(p + 8),
    offset = ico.readUInt32LE(p + 12),
    m = await sharp(ico.subarray(offset, offset + len)).metadata();
  const expected = [16, 32, 48, 64, 256][i];
  check(
    m.width === expected && m.height === expected,
    "ICO embedded raster " + expected,
  );
}
const out = {
  checkedAt: new Date().toISOString(),
  buildId: build.buildId,
  sourceFingerprint: build.sourceFingerprint,
  scope:
    "Compiled static HTML/XML and decoded assets; no production server or browser runtime pass",
  result: errors.length ? "failed" : "passed-static",
  pages: results,
  sitemap: { entries, coverage: inventory.length },
  dateBehavior: { unchangedPreserved: true, changedAndNewOnly: true },
  icons,
  errors,
  mediaAcceptance: "NOT_PASSED",
  overallDelivery: "NOT_PASSED",
};
fs.writeFileSync(
  "reports/site-seo-identity-results.json",
  JSON.stringify(out, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      result: out.result,
      pages: results.length,
      sitemap: entries.length,
      errors,
    },
    null,
    2,
  ),
);
if (errors.length) process.exitCode = 1;
