const fs = require("fs"),
  path = require("path"),
  crypto = require("crypto");
module.exports = function inputIdentity() {
  const hash = crypto.createHash("sha256");
  const walk = (p) => {
    if (!fs.existsSync(p)) return;
    if (fs.statSync(p).isDirectory()) {
      for (const f of fs.readdirSync(p).sort()) walk(path.join(p, f));
    } else {
      hash.update(p.replaceAll("\\", "/"));
      hash.update(fs.readFileSync(p));
    }
  };
  for (const p of [
    "app",
    "components",
    "lib",
    "config",
    "data",
    "public",
    "seo",
    "scripts",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "proxy.ts",
    "tsconfig.json",
    "research/media-check-candidates.json",
    "planning/site-capabilities.json",
    "research/media-ledger.json",
    "research/video-analysis.json",
    "research/runtime-issues.json",
  ])
    walk(p);
  return hash.digest("hex");
};
