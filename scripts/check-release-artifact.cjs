// One-shot prestart gate; this file never launches a service.
try {
  const identity = require("./check-build-identity.cjs")(".next", "release");
  console.log("Release build identity confirmed: " + identity.buildId);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
