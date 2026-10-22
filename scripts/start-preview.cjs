const dir = ".next-preview",
  standalone = dir + "/standalone";
const { buildId } = require("./check-build-identity.cjs")(dir, "draft");
require("./local-server.cjs")({
  mode: "production-preview",
  port: 4318,
  buildId,
  args: [standalone + "/server.js"],
}).catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
