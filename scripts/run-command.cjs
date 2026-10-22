const fs = require("fs"),
  cp = require("child_process"),
  inputIdentity = require("./input-identity.cjs");
const name = process.argv[2];
const commands = {
  lint: ["node_modules/eslint/bin/eslint.js", "."],
  typecheck: ["node_modules/typescript/bin/tsc", "--noEmit"],
  test: ["--test", "--test-reporter=tap", "tests/security.test.mjs"],
  data: ["scripts/validate.mjs", "draft"],
  content: ["scripts/check-content.mjs"],
  assets: ["scripts/check-assets.mjs"],
  media: ["scripts/validate.mjs", "media"],
  release: ["scripts/validate.mjs", "release"],
  compile: ["node_modules/next/dist/bin/next", "build"],
  format: [
    "node_modules/prettier/bin/prettier.cjs",
    "--write",
    "app",
    "components",
    "lib",
    "seo/tdk.js",
    "next.config.ts",
  ],
};
commands.test.push("tests/fingerprints.test.mjs");
commands.test.push("tests/video-review.test.mjs");
commands.test.push("tests/content-text.test.mjs");
commands.test.push("tests/development-contracts.test.mjs");
commands.test.push("tests/recommendations.test.mjs");
commands.test.push("tests/data-contracts.test.mjs");
commands.test.push("tests/build-identity.test.mjs");
commands.fingerprints = ["scripts/check-fingerprints.mjs"];
commands.dates = ["scripts/check-fingerprints.mjs", "--update"];
commands.seo = ["scripts/check-seo.mjs"];
commands.siteseo = ["scripts/check-site-seo.mjs"];
commands.smoke = ["scripts/smoke-preview.mjs"];
commands.localmedia = ["scripts/check-local-media.mjs"];
commands.routes = ["scripts/prepare-routes.mjs"];
commands.audit = [
  require("path").join(
    require("path").dirname(process.execPath),
    "node_modules/npm/bin/npm-cli.js",
  ),
  "audit",
  "--json",
  "--cache",
  ".npm-cache",
];
commands.auditprod = [
  require("path").join(
    require("path").dirname(process.execPath),
    "node_modules/npm/bin/npm-cli.js",
  ),
  "audit",
  "--omit=dev",
  "--json",
  "--cache",
  ".npm-cache",
];
commands.format.push("scripts", "tests", "seo/fingerprints.mjs", "proxy.ts");
if (!commands[name]) throw new Error("Unknown command");
fs.mkdirSync("reports/logs", { recursive: true });
const id = new Date().toISOString().replace(/[:.]/g, "-") + "-" + name;
const record = {
  id,
  kind: "one-shot",
  command: [process.execPath, ...commands[name]],
  cwd: process.cwd(),
  startedAt: new Date().toISOString(),
  pid: null,
  exitCode: null,
  port: null,
  readiness: null,
  buildIdentity: null,
  inputFingerprint: inputIdentity(),
  identityBasis:
    "Source fingerprint for one-shot checks; compiler BUILD_ID recorded separately",
  logPath: "reports/logs/" + id + ".log",
  stopMethod: "natural exit",
  testStats: null,
};
const child = cp.spawn(process.execPath, commands[name], {
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});
record.pid = child.pid;
let output = "";
for (const stream of [child.stdout, child.stderr])
  stream.on("data", (b) => {
    output += b;
    process.stdout.write(b);
  });
child.on("exit", (code, signal) => {
  record.exitCode = code;
  record.signal = signal;
  record.endedAt = new Date().toISOString();
  record.inputFingerprintAfter = inputIdentity();
  record.sourceChangedDuringCommand =
    record.inputFingerprintAfter !== record.inputFingerprint;
  record.testStats =
    name === "test"
      ? Object.fromEntries(
          [
            ...output.matchAll(
              /^# (tests|suites|pass|fail|cancelled|skipped|todo) (\d+)/gm,
            ),
          ].map((m) => [m[1], Number(m[2])]),
        )
      : null;
  if (name === "compile") {
    const p =
      (process.env.LOCAL_DRAFT_BUILD === "1" ? ".next-preview" : ".next") +
      "/BUILD_ID";
    record.buildIdentity =
      code === 0 && fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim() : null;
    record.buildIdentityMethod =
      "BUILD_ID after successful compiler exit; null on failure";
  }
  fs.writeFileSync(record.logPath, output);
  const file = "reports/command-results.json";
  let data = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file))
    : { commands: [] };
  data.commands.push(record);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  if (name === "compile" && code === 0 && record.sourceChangedDuringCommand) {
    console.error(
      "Source/assets changed during compilation; artifact must be rebuilt.",
    );
    process.exitCode = 1;
  } else process.exitCode = code ?? 1;
});
