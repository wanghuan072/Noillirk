const fs = require("node:fs"),
  path = require("node:path");
const fingerprint = require("./input-identity.cjs");
module.exports = function checkBuildIdentity(directory, scope) {
  const file = path.join(directory, "build-identity.json");
  if (!fs.existsSync(file))
    throw Error(
      "No recorded " + scope + " build. Rebuild before starting this artifact.",
    );
  const identity = JSON.parse(fs.readFileSync(file, "utf8"));
  const buildId = fs
    .readFileSync(path.join(directory, "BUILD_ID"), "utf8")
    .trim();
  if (
    identity.scope !== scope ||
    identity.buildId !== buildId ||
    identity.sourceFingerprint !== fingerprint()
  )
    throw Error(
      "Build identity differs from current source/assets. Rebuild before starting this artifact.",
    );
  return identity;
};
