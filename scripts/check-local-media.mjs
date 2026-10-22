import fs from "node:fs";
import http from "node:http";

// Inspect the user's existing service only. This command never starts a server.
const port = Number(process.env.EXISTING_DEV_PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw Error("Invalid existing development port");
const cases = [
  { path: "/media-check?id=hello-wordl", host: "localhost", expected: 200 },
  { path: "/media-check?id=not-allowlisted", host: "localhost", expected: 404 },
  {
    path: "/media-check?id=hello-wordl",
    host: "untrusted.example",
    expected: 404,
  },
];
const rows = [];
for (const item of cases) {
  const row = await new Promise((resolve) => {
    const req = http.get(
      {
        hostname: "127.0.0.1",
        port,
        path: item.path,
        headers: { Host: `${item.host}:${port}` },
        timeout: 15000,
      },
      (res) => {
        let text = "";
        res.on("data", (data) => {
          text += data;
        });
        res.on("end", () =>
          resolve({
            ...item,
            actual: res.statusCode,
            csp: res.headers["content-security-policy"],
            robots: res.headers["x-robots-tag"],
            cache: res.headers["cache-control"],
            hasHelloFrame: text.includes('src="https://hellowordl.net/"'),
            hasNocookie: text.includes(
              "youtube-nocookie.com/embed/VIavCrvnrDs",
            ),
          }),
        );
      },
    );
    req.on("timeout", () =>
      req.destroy(Error("Existing service request timed out")),
    );
    req.on("error", (error) =>
      resolve({ ...item, error: error.message, actual: null }),
    );
  });
  row.result =
    row.actual === row.expected &&
    (item.expected !== 200 ||
      (row.hasHelloFrame &&
        row.hasNocookie &&
        row.csp?.includes("frame-ancestors 'none'") &&
        !row.csp.includes("unsafe-eval") &&
        row.robots?.includes("noindex")))
      ? "passed"
      : "failed";
  rows.push(row);
}
const output = {
  checkedAt: new Date().toISOString(),
  serviceOwnership: "user",
  agentStartedServices: false,
  origin: `http://localhost:${port}`,
  scope:
    "Existing development HTTP responses only; no gameplay, browser execution or production acceptance",
  result: rows.every((r) => r.result === "passed") ? "passed" : "failed",
  rows,
};
fs.writeFileSync(
  "reports/local-media-http-results.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log(JSON.stringify(output, null, 2));
process.exitCode = output.result === "passed" ? 0 : 1;
