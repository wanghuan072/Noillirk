const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json"));
Object.assign(p.scripts, {
  build: "node scripts/build-release.cjs",
  "build:preview": "node scripts/build-preview.cjs",
  lint: "node scripts/run-command.cjs lint",
  typecheck: "node scripts/run-command.cjs typecheck",
  test: "node scripts/run-command.cjs test",
  "check:data": "node scripts/run-command.cjs data",
  "check:media": "node scripts/run-command.cjs media",
  "check:release": "node scripts/run-command.cjs release",
  format: "node scripts/run-command.cjs format",
  preview: "node scripts/start-preview.cjs",
});
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
