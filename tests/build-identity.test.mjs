import { test } from "node:test";
import assert from "node:assert/strict";
import assertCompiledInput from "../scripts/compiled-input.cjs";
const valid = {
  exitCode: 0,
  buildIdentity: "actual-build",
  inputFingerprint: "source",
  inputFingerprintAfter: "source",
  sourceChangedDuringCommand: false,
};
test("packaging requires the actual successful compiler ID and unchanged inputs", () => {
  assert.doesNotThrow(() =>
    assertCompiledInput(valid, "actual-build", "source"),
  );
  for (const record of [
    null,
    { ...valid, exitCode: 1 },
    { ...valid, buildIdentity: "old-build" },
    { ...valid, inputFingerprint: "older-source" },
    { ...valid, inputFingerprintAfter: "new-source" },
    { ...valid, sourceChangedDuringCommand: true },
  ])
    assert.throws(
      () => assertCompiledInput(record, "actual-build", "source"),
      /stale/,
    );
});
