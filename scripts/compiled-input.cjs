module.exports = function assertCompiledInput(
  record,
  buildId,
  currentFingerprint,
) {
  if (
    !record ||
    record.exitCode !== 0 ||
    record.buildIdentity !== buildId ||
    record.sourceChangedDuringCommand ||
    record.inputFingerprint !== currentFingerprint ||
    record.inputFingerprintAfter !== currentFingerprint
  )
    throw Error(
      "Compiler input identity is missing, changed or stale; rebuild before packaging.",
    );
};
