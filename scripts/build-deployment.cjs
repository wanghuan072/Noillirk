const cp = require("node:child_process");
const deployment = require("../config/deployment.json");
if (deployment.mode === "release") {
  const result = cp.spawnSync(process.execPath, ["scripts/build-release.cjs"], {
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}
if (deployment.mode !== "review") {
  console.error("Unknown deployment mode; expected review or release.");
  process.exit(1);
}
// User-authorized page review deployment. This does not publish Game/Guide
// records or turn media/gameplay acceptance into a passing result.
for (const name of [
  "routes",
  "data",
  "content",
  "assets",
  "dates",
  "fingerprints",
  "seo",
  "compile",
]) {
  const result = cp.spawnSync(
    process.execPath,
    ["scripts/run-command.cjs", name],
    {
      stdio: "inherit",
      env: { ...process.env, LOCAL_DRAFT_BUILD: "" },
    },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const identity = require("./package-build.cjs")(".next", "review");
console.log(
  JSON.stringify({
    buildId: identity.buildId,
    deploymentMode: "review",
    searchIndexing: "disabled",
    mediaAcceptance: "NOT_PASSED",
    gameplayAcceptance: "NOT_PASSED",
  }),
);
