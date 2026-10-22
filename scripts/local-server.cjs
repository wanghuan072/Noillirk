const fs = require("fs"),
  cp = require("child_process"),
  net = require("net");
const inputIdentity = require("./input-identity.cjs");
module.exports = async function start({ mode, port, args, buildId, prepare }) {
  await new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(port, "127.0.0.1", () => probe.close(resolve));
  });
  if (prepare) prepare();
  fs.mkdirSync("reports/logs", { recursive: true });
  const record = {
    id: mode + "-" + Date.now(),
    kind: "service",
    mode,
    command: [process.execPath, ...args],
    cwd: process.cwd(),
    startedAt: new Date().toISOString(),
    pid: null,
    exitCode: null,
    testStats: null,
    port,
    readiness: {
      url: "http://127.0.0.1:" + port + "/preview",
      result: "pending",
    },
    buildIdentity: buildId || "development-source-" + inputIdentity(),
    identityBasis: buildId
      ? "standalone BUILD_ID"
      : "development source fingerprint; not a production BUILD_ID",
    inputFingerprint: inputIdentity(),
    logPath: "reports/logs/" + mode + "-" + Date.now() + ".log",
    stopMethod:
      "Stop only the recorded child after confirming command line and listening PID; wrapper records real child exit",
    status: "starting",
  };
  const file = "reports/command-results.json";
  const save = () => {
    const data = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file))
      : { commands: [] };
    const i = data.commands.findIndex((x) => x.id === record.id);
    if (i < 0) data.commands.push(record);
    else data.commands[i] = record;
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  };
  const child = cp.spawn(process.execPath, args, {
    env: {
      ...process.env,
      LOCAL_DRAFT_BUILD: "1",
      NODE_ENV: mode === "development" ? "development" : "production",
      PORT: String(port),
      HOSTNAME: "127.0.0.1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  record.pid = child.pid;
  save();
  let exited = false;
  for (const stream of [child.stdout, child.stderr])
    stream.on("data", (b) => {
      fs.appendFileSync(record.logPath, b);
      process.stdout.write(b);
    });
  child.on("error", (error) => {
    exited = true;
    record.status = "failed";
    record.error = error.message;
    save();
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    exited = true;
    record.exitCode = code;
    record.signal = signal;
    record.status = record.readiness.result === "ready" ? "stopped" : "failed";
    record.endedAt = new Date().toISOString();
    save();
  });
  for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, () => {
      record.stopRequestedAt = new Date().toISOString();
      save();
      child.kill();
    });
  for (let n = 0; n < 60 && !exited; n++) {
    try {
      const r = await fetch(record.readiness.url, {
          signal: AbortSignal.timeout(2000),
        }),
        html = await r.text();
      if (
        !exited &&
        r.status === 200 &&
        r.headers.get("x-robots-tag")?.includes("noindex") &&
        html.includes("Local draft preview")
      ) {
        record.readiness = {
          ...record.readiness,
          result: "ready",
          status: r.status,
          checkedAt: new Date().toISOString(),
        };
        record.status = "running";
        record.inputFingerprint = inputIdentity();
        if (!buildId)
          record.buildIdentity =
            "development-source-" + record.inputFingerprint;
        save();
        console.log(
          JSON.stringify({
            ready: true,
            pid: child.pid,
            port,
            buildId: record.buildIdentity,
            mode,
          }),
        );
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  if (!exited) {
    record.readiness.result = "failed";
    save();
    child.kill();
    process.exitCode = 1;
  }
};
