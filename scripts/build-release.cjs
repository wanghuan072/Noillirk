const cp = require("child_process");
if (require("../config/deployment.json").mode !== "release") {
  console.error(
    "Release deployment requires config/deployment.json mode=release and all release checks. Current mode is review.",
  );
  process.exit(1);
}
for (const name of [
  "routes",
  "release",
  "assets",
  "dates",
  "fingerprints",
  "seo",
  "compile",
]) {
  const result = cp.spawnSync(
    process.execPath,
    ["scripts/run-command.cjs", name],
    { stdio: "inherit", env: { ...process.env, LOCAL_DRAFT_BUILD: "" } },
  );
  if (result.status !== 0) process.exit(result.status || 1);
}
const identity = require("./package-build.cjs")(".next", "release");
console.log(
  JSON.stringify({
    packagedRelease: identity.buildId,
    runtimeAcceptance: "requires_final_browser_acceptance",
  }),
);
