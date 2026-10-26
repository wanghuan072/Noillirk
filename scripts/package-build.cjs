const fs = require("node:fs"),
  path = require("node:path");
const fingerprint = require("./input-identity.cjs");
module.exports = function packageBuild(directory, scope) {
  const buildId = fs
    .readFileSync(path.join(directory, "BUILD_ID"), "utf8")
    .trim();
  const inputFingerprint = fingerprint();
  const commands = JSON.parse(
    fs.readFileSync("reports/command-results.json", "utf8"),
  ).commands;
  const compiled = commands.findLast((c) => c.buildIdentity === buildId);
  require("./compiled-input.cjs")(compiled, buildId, inputFingerprint);
  const standalone = path.join(directory, "standalone");
  if (!fs.existsSync(path.join(standalone, "server.js")))
    throw Error("Standalone server artifact missing");
  if (![".next", ".next-preview"].includes(directory))
    throw Error("Unexpected build directory");
  const workspace = fs.realpathSync(".");
  const resolvedStandalone = fs.realpathSync(standalone);
  if (!resolvedStandalone.startsWith(workspace + path.sep))
    throw Error("Build output resolves outside project");
  const replace = (source, destination) => {
    const absolute = path.resolve(destination);
    if (!absolute.startsWith(resolvedStandalone + path.sep))
      throw Error("Unexpected artifact copy destination");
    let ancestor = path.dirname(absolute);
    while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
    const resolvedAncestor = fs.realpathSync(ancestor);
    if (
      resolvedAncestor !== resolvedStandalone &&
      !resolvedAncestor.startsWith(resolvedStandalone + path.sep)
    )
      throw Error("Artifact parent resolves outside standalone output");
    if (
      fs.existsSync(absolute) &&
      !fs.realpathSync(absolute).startsWith(resolvedStandalone + path.sep)
    )
      throw Error("Artifact destination resolves outside standalone output");
    fs.rmSync(absolute, { recursive: true, force: true });
    fs.cpSync(source, absolute, { recursive: true });
  };
  replace("public", path.join(standalone, "public"));
  replace(
    path.join(directory, "static"),
    path.join(standalone, directory, "static"),
  );
  const identity = {
    buildId,
    scope,
    sourceFingerprint: inputFingerprint,
    compiledAt: new Date().toISOString(),
    output: standalone.replaceAll("\\", "/"),
    runtimeAcceptance: "not_established_by_compilation",
    mediaAcceptance:
      scope === "release"
        ? "requires_current_acceptance_manifest"
        : "NOT_PASSED",
  };
  if (fingerprint() !== inputFingerprint)
    throw Error("Source/assets changed while packaging; rebuild required.");
  fs.writeFileSync(
    path.join(directory, "build-identity.json"),
    JSON.stringify(identity, null, 2) + "\n",
  );
  return identity;
};
