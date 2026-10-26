// One-shot prestart gate; this file never launches a service.
try {
  const mode = require("../config/deployment.json").mode;
  if (!["review", "release"].includes(mode))
    throw Error("Unknown deployment mode");
  const identity = require("./check-build-identity.cjs")(".next", mode);
  console.log(mode + " build identity confirmed: " + identity.buildId);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
