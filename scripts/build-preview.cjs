const cp = require("child_process");
for (const name of [
  "routes",
  "data",
  "assets",
  "dates",
  "fingerprints",
  "seo",
]) {
  const child = cp.spawnSync(
    process.execPath,
    ["scripts/run-command.cjs", name],
    { stdio: "inherit" },
  );
  if (child.status !== 0) process.exit(child.status || 1);
}
const result = cp.spawnSync(
  process.execPath,
  ["scripts/run-command.cjs", "compile"],
  { stdio: "inherit", env: { ...process.env, LOCAL_DRAFT_BUILD: "1" } },
);
if (result.status !== 0) process.exit(result.status || 1);
const identity = require("./package-build.cjs")(".next-preview", "draft");
console.log(
  JSON.stringify({
    packagedDraft: identity.buildId,
    runtimeAcceptance: "not_established_by_compilation",
  }),
);
