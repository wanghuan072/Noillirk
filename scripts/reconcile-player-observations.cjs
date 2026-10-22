const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const report = read("reports/player-runtime-results.json"),
  baseline = read("reports/acceptance-evidence/draft-iframe-observations.json"),
  games = read("data/games/games.json");
for (const row of report.games) {
  const game = games.find((g) => g.id === row.gameId),
    observed = baseline.observations.find((o) => o.gameId === row.gameId);
  if (!game) continue;
  row.configuredSandbox = game.player.sandbox;
  row.identityObservationBuildId = baseline.buildId;
  row.sandbox = observed?.sandbox?.split(" ") || null;
  row.currentBuildPublicationQualified = false;
  if (row.inputTest?.result === "passed-in-shared-context")
    row.inputTest.sandboxAtTest =
      row.gameId === "fermi"
        ? ["allow-scripts", "allow-same-origin", "allow-forms"]
        : row.sandbox;
}
const main = report.games.find((g) => g.gameId === "noillirk");
main.networkObservation =
  "No comprehensive frame-network audit; empty networkErrors is not a network pass.";
report.pendingPublicationQualificationGameIds = games.map((g) => g.id);
report.missingAcceptedCoreInputGameIds = ["krillion", "maptap", "word-hunt"];
report.thirdPartyNetworkAudit = "incomplete";
report.originQualification =
  "Local parent origin only; formal origin not deployed or accepted.";
fs.writeFileSync(
  "reports/player-runtime-results.json",
  JSON.stringify(report, null, 2) + "\n",
);
